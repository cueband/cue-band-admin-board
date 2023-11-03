const Parse = require('parse');


const { jsPDF } = require("jspdf");
require('jspdf-autotable');

const math = require('mathjs')

const randomBytes = require('randombytes');

window.Buffer = window.Buffer || require("buffer").Buffer; 

Parse.initialize(process.env.VUE_APP_APP_ID, process.env.VUE_APP_JAVASCRIPT_KEY, process.env.VUE_APP_MASTER_KEY);
Parse.masterKey = process.env.VUE_APP_MASTER_KEY;

Parse.serverURL = process.env.VUE_APP_SERVER_URL

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.VUE_APP_SENDGRID_API_KEY);

// const DELIVERY_PROGRESS_AWAITING_PROCESSING = "Awaiting processing";
const DELIVERY_PROGRESS_DEVICE_SENT = "Device Sent";

const isDeviceSent = (label) => {
    return label.get("deviceBox");
}

const setDeviceSentProgress = async (label) => {
    var date = new Date().toUTCString();
    const StudyData = Parse.Object.extend("StudyData");
    const query = new Parse.Query(StudyData);
    query.equalTo("user", label.get("user"));
    const results = await query.find({useMasterKey: true});
    for (let result of results) {
        result.set("deliveryProgress", DELIVERY_PROGRESS_DEVICE_SENT);
        result.set("serverLastUpdate", new Date(date));
        await result.save({}, {useMasterKey: true});

        //EMAIL
        await sendDeviceSentEmail(result.get("insertTokenEmail"), label.get("address"), label.get("trackingCode"));  
    }
} 

const sendDeviceSentEmail = async (email, address, trackingCode) => {
    try {
        const result = await Parse.Cloud.run("sendDeviceSentEmail", {email, address, trackingCode}, {useMasterKey: true});
        return result.code == 200;
    } catch(e) {
        return false;
    }
}

exports.setDeviceOrderExported = async (rowIds) => {
    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.containedIn("objectId", rowIds);
    const results = await query.find({useMasterKey: true});
    console.log(results);
    for (let result of results) {
        result.set("isReportExported", true);
        await result.save({}, {useMasterKey: true});
    }
} 

exports.GetUsers = async () => {
    const User = Parse.Object.extend("User");
    const query = new Parse.Query(User);
    query.limit(5000);
    const results = await query.find();
    return results;
}

exports.GetStudyData = async () => {
    const StudyData = Parse.Object.extend("StudyData");
    const query = new Parse.Query(StudyData);
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.GetStudyDataById = async (id) => {
    const StudyData = Parse.Object.extend("StudyData");
    const query = new Parse.Query(StudyData);
    query.equalTo("objectId", id)
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.getConsentReports = async () => {
    const ConsentReports = Parse.Object.extend("ConsentReport");
    const query = new Parse.Query(ConsentReports);
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.getDeviceOrderReports = async () => {
    const DeviceOrderReport = Parse.Object.extend("DeviceOrderReport");
    const query = new Parse.Query(DeviceOrderReport);
    query.limit(5000);
    const results = await query.find();
    return results;
}

exports.GetUnexportedDeviceOrderCounts = async () => {
    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.containedIn("isReportExported", [false, null]);
    query.notEqualTo("deviceBox", null);
    const count = await query.count({useMasterKey: true});
    return count;
}

exports.GetUnexportedDeviceOrders = async () => {
    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.containedIn("isReportExported", [false, null]);
    query.notEqualTo("deviceBox", null);
    query.ascending("updatedAt");
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.GetUsersDeliveryInfoByIdArr = async (userIds) => {
    const User = Parse.Object.extend("User");
    const userQuery = new Parse.Query(User);
    userQuery.containedIn("objectId", userIds);

    const DeliveryAddress = Parse.Object.extend("DeliveryAddress");
    const addressQuery = new Parse.Query(DeliveryAddress);
    addressQuery.matchesKeyInQuery("user", "objectId", userQuery);
    const results = await addressQuery.find({useMasterKey: true});
    return results;
}

exports.getDeviceOrderByTrackingCode = async (trackingCode) => {
    const DeviceOrder = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrder);
    query.equalTo("trackingCode", trackingCode);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.getDeviceOrderByLabel = async (labelCode) => {
    let trimmedLabelCode = labelCode.substring(3);
    const DeviceOrder = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrder);
    query.equalTo("objectId", trimmedLabelCode);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.getDeviceBoxById = async (deviceBox) => {
    const DeviceBox = Parse.Object.extend("DeviceBoxSchema");
    const query = new Parse.Query(DeviceBox);
    query.equalTo("objectId", deviceBox);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.getDeviceBoxByBoxNumber = async (boxNumber) => {
    const DeviceBox = Parse.Object.extend("DeviceBoxSchema");
    const query = new Parse.Query(DeviceBox);
    query.equalTo("boxNumber", boxNumber);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.GetAllConsent = async () => {
    const Consent = Parse.Object.extend("Consent");
    const query = new Parse.Query(Consent);
    query.select("token", "name");
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    return results;
} 

exports.GetConsent = async (token) => {
    const Consent = Parse.Object.extend("Consent");
    const query = new Parse.Query(Consent);
    query.equalTo("token", token);
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    return results;
} 

exports.GetDemographicsData = async (token) => {
    const DemographicsData = Parse.Object.extend("DemographicsData");
    const query = new Parse.Query(DemographicsData);
    query.equalTo("token", token);
    const results = await query.find({useMasterKey: true});
    return results;
} 

exports.GetDiaryEntries = async (user) => {
    const DiaryEntry = Parse.Object.extend("DiaryEntry");
    const query = new Parse.Query(DiaryEntry);
    query.include('user');
    query.equalTo("user", user);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.GetCueingMethodCounts = async () => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryPhoneCueband = new Parse.Query(StudyData);
    queryPhoneCueband.equalTo("cueingMethod1", "phone");
    queryPhoneCueband.equalTo("cueingMethod2", "cueband");
    const countPhoneCueband = await queryPhoneCueband.count({useMasterKey: true});

    const queryCuebandPhone = new Parse.Query(StudyData);
    queryCuebandPhone.equalTo("cueingMethod1", "cueband");
    queryCuebandPhone.equalTo("cueingMethod2", "phone");
    const countCuebandPhone = await queryCuebandPhone.count({useMasterKey: true});
    
    return {
        cuebandPhone: countCuebandPhone,
        phoneCueband: countPhoneCueband    
    };
} 

exports.GetUserStudyEmailCounts = async () => {
    const StudyInterest = Parse.Object.extend("StudyInterest");
    const studyInterestQuery = new Parse.Query(StudyInterest);
    studyInterestQuery.equalTo("activated", true);
    const studyInterestCount = await studyInterestQuery.count({useMasterKey: true});

    const androidStudyInterestQuery = new Parse.Query(StudyInterest);
    androidStudyInterestQuery.equalTo("activated", true)
    androidStudyInterestQuery.equalTo("smartphoneType", "android")
    const androidStudyInterestCount = await androidStudyInterestQuery.count({useMasterKey: true});

    const iOSStudyInterestQuery = new Parse.Query(StudyInterest);
    iOSStudyInterestQuery.equalTo("activated", true)
    iOSStudyInterestQuery.equalTo("smartphoneType", "ios")
    const iOSStudyInterestCount = await iOSStudyInterestQuery.count({useMasterKey: true});

    const UserStudyEmail = Parse.Object.extend("UserStudyEmail");
    const UserStudyEmailQuery = new Parse.Query(UserStudyEmail);
    const userStudyEmailCount = await UserStudyEmailQuery.count({useMasterKey: true});

    const androidUserStudyEmailQuery = new Parse.Query(UserStudyEmail);
    androidUserStudyEmailQuery.equalTo("studyInterest.smartphoneType", "android")
    const androidUserStudyEmailCount = await androidUserStudyEmailQuery.count({useMasterKey: true});

    const iOSUserStudyEmailQuery = new Parse.Query(UserStudyEmail);
    iOSUserStudyEmailQuery.equalTo("studyInterest.smartphoneType", "ios")
    const iOSUserStudyEmailCount = await iOSUserStudyEmailQuery.count({useMasterKey: true});

    return {
        android: {
            totalUserCount: androidStudyInterestCount,
            studyEmailUserCount: androidUserStudyEmailCount
        },
        ios: {
            totalUserCount: iOSStudyInterestCount,
            studyEmailUserCount: iOSUserStudyEmailCount
        },
        total: {
            totalUserCount: studyInterestCount,
            studyEmailUserCount: userStudyEmailCount
        }
    }
}

exports.GetUserForFirstStudyEmail = async (type, limit) => {
    const UserStudyEmail = Parse.Object.extend("UserStudyEmail");
    const userStudyEmailQuery = new Parse.Query(UserStudyEmail);
    userStudyEmailQuery.select("studyInterest");
    const userStudyEmailIds = await userStudyEmailQuery.find({useMasterKey: true});
    const StudyInterest = Parse.Object.extend("StudyInterest");
    const studyInterestQuery = new Parse.Query(StudyInterest);
    studyInterestQuery.equalTo("activated", true);
    if (type != "all") studyInterestQuery.equalTo("smartphoneType", type);
    studyInterestQuery.notContainedIn("objectId", userStudyEmailIds.map(e => e.get("studyInterest").id));
    studyInterestQuery.limit(limit);
    studyInterestQuery.ascending("createdAt");
    const studyInterestUsers = await studyInterestQuery.find({useMasterKey: true});
    return studyInterestUsers;
}


exports.SaveStudyDataState = async (studyDataObject, branch, cueingMethod1, cueingMethod2) => {

    try {
        console.log(studyDataObject, branch, cueingMethod1, cueingMethod2)

        var date = new Date().toUTCString();
        studyDataObject.set("studyBranch", branch);
    
        if(branch == "Trial") { 
            studyDataObject.set("currentState", "AskDeliveryInfo");
            studyDataObject.set("cueingMethod1", cueingMethod1);
            studyDataObject.set("cueingMethod2", cueingMethod2);
        } else if(branch == "FreeLiving") {
            studyDataObject.set("currentState", "AskDeliveryInfo");
        } else if(branch == "NoStudy") {
            studyDataObject.set("currentState", "NoStudy");
        }
    
        studyDataObject.set("serverLastUpdate", new Date(date));
        studyDataObject.set("previousState", "WaitingForBranchApproval");
    
        return await studyDataObject.save({}, {useMasterKey: true});
    } catch(e) {
        console.log(e);
        return null;
    }

}

exports.saveLabelTrackingCodeData = async ({labelObject, trackingCode, boxNumber}) => {
    let deviceBoxId = null;
    const DeviceBox = Parse.Object.extend("DeviceBoxSchema");
    const query = new Parse.Query(DeviceBox);
    query.equalTo("boxNumber", boxNumber);
    query.equalTo("user", labelObject.get('user'));
    const boxResults = await query.find({useMasterKey: true});
    
    if (boxResults.length == 0) {
        const deviceBox = new DeviceBox();
        deviceBox.set('boxNumber', boxNumber);
        deviceBox.set('user', labelObject.get('user'));
        const deviceBoxACL = new Parse.ACL();
        deviceBoxACL.setPublicReadAccess(false);
        deviceBox.setACL(deviceBoxACL);
        const deviceBoxSave = await deviceBox.save({}, {useMasterKey: true});
        deviceBoxId = deviceBoxSave.id;
    } else {
        deviceBoxId = boxResults[0].id;
    }

    if (trackingCode) labelObject.set("trackingCode", trackingCode);
    labelObject.set("deviceBox", deviceBoxId);
    if (deviceBoxId) {
        const deviceOrderACL = new Parse.ACL(labelObject.get('user'));
        deviceOrderACL.setPublicReadAccess(false);
        labelObject.setACL(deviceOrderACL);
    }
    let result = await labelObject.save({}, { useMasterKey: true });

    if (isDeviceSent(labelObject)) {
        await setDeviceSentProgress(labelObject);
    }
    return result;
}

exports.saveAddressLabel = async ({trackingCode, user, labelId, name, address, boxNumber}) => {
    let deviceBoxId = null;
    if (boxNumber){
        const DeviceBox = Parse.Object.extend("DeviceBoxSchema");
        const query = new Parse.Query(DeviceBox);
        query.equalTo("boxNumber", boxNumber);
        query.equalTo("user", user);
        const boxResults = await query.find({useMasterKey: true});
        
        if (boxResults.length == 0) {
            const deviceBox = new DeviceBox();
            deviceBox.set('boxNumber', boxNumber);
            deviceBox.set('user', user);
            const deviceBoxACL = new Parse.ACL();
            deviceBoxACL.setPublicReadAccess(false);
            deviceBox.setACL(deviceBoxACL);
            const deviceBoxSave = await deviceBox.save();
            deviceBoxId = deviceBoxSave.id;
        } else {
            deviceBoxId = boxResults[0].id;
        }
    }

    const DeviceOrder = Parse.Object.extend("DeviceOrderSchema");
    const deviceOrder = new DeviceOrder();
    deviceOrder.set('user', user);
    if (name) deviceOrder.set('name', name);
    if (address) deviceOrder.set('address', address);
    if (trackingCode) deviceOrder.set('trackingCode', trackingCode);
    if (deviceBoxId) deviceOrder.set('deviceBox', deviceBoxId);
    if (labelId) deviceOrder.set('labelId', labelId);

    const deviceOrderACL = (deviceBoxId) ? new Parse.ACL(user) : new Parse.ACL();
    deviceOrderACL.setPublicReadAccess(false);
    deviceOrder.setACL(deviceOrderACL);
    let deviceOrderSave = await deviceOrder.save();
    console.log(deviceOrder);
    console.log(deviceOrderSave);
    if (isDeviceSent(deviceOrder)) {
        setDeviceSentProgress(deviceOrder);
    }
    return deviceOrderSave;
}

exports.SendBranchEmail = async(email, branch) => {
   
    const result = await Parse.Cloud.run("sendBranchEmail", {email, branch}, {useMasterKey: true});
    return result.code == 200;
}

exports.UserHasBeenAllocated = async(user) => {
    const RandomAllocation = Parse.Object.extend("RandomAllocation");
    const query = new Parse.Query(RandomAllocation);
    query.equalTo("user", user);
    const randomAllocationResult = await query.find({useMasterKey: true});
    return randomAllocationResult.length != 0;
}

exports.GetRandomAllocationCount = async() => {
    const RandomAllocation = Parse.Object.extend("RandomAllocation");
    const query = new Parse.Query(RandomAllocation);
    return await query.count({useMasterKey: true});
}

exports.GetNextFreeRandomAllocation = async() => {
    const RandomAllocation = Parse.Object.extend("RandomAllocation");
    const query = new Parse.Query(RandomAllocation);
    query.equalTo("allocated", false);
    query.ascending("order");
    const randomAllocationResult = await query.find({useMasterKey: true});
    if(randomAllocationResult.length == 0) {
        return null;
    } else {
        return randomAllocationResult[0];
    }
}

exports.GenerateNextRandomAllocation = async(nAllocations) => {
    const result = await Parse.Cloud.run("generateRandomAllocations", {nAllocations}, {useMasterKey: true});
    return result;
}

exports.SaveRandomAllocation = async(user, randomAllocation) => {
    if(user == null || randomAllocation == null) {
        return null;
    }
    randomAllocation.set('user', user);
    randomAllocation.set('allocated', true);
    let result = await randomAllocation.save({}, {useMasterKey: true});
    return result;
}

exports.SaveDeviceOrderReport = async ({ file, filename, startDate, endDate }) => {
    try {
        const parseFile = new Parse.File(filename, file);
        let saveFileResult = await parseFile.save();
        if (saveFileResult.code != null) {
            return;
        }
  
        console.log(parseFile.url());
        console.log("The file has been saved to Parse.")
        const DeviceOrderReport = Parse.Object.extend("DeviceOrderReport");
        const DeviceOrderReportObject = new DeviceOrderReport();
        DeviceOrderReportObject.set("startDate", startDate);
        DeviceOrderReportObject.set("endDate", endDate);
        DeviceOrderReportObject.set("csvFile", parseFile);
        await DeviceOrderReportObject.save();
        return DeviceOrderReportObject;
    } catch(e) {
        console.log("The file either could not be read, or could not be saved to Parse.", e)
    }
}

exports.CheckEmailExistsOnStudyInterest = async(email) => {
    if(email == null || email == '') {
        return false;
    }
    const StudyInterest = Parse.Object.extend("StudyInterest");
    const query = new Parse.Query(StudyInterest);
    query.equalTo("email", email);
    const queryResult = await query.count({useMasterKey: true});

    return queryResult > 0;
}


exports.AddStudyInterest = async(studyInterestObject) => {

    try {

        const StudyInterest = Parse.Object.extend("StudyInterest");
        const studyInterest = new StudyInterest();

        if(studyInterestObject['EMAIL']) {
           
            studyInterest.set('email', studyInterestObject['EMAIL']);
        }
    
        if(studyInterestObject['consent_get_involved_activated']) {
            studyInterest.set('activated', studyInterestObject['consent_get_involved_activated'] == "true");
        }
    
        if(studyInterestObject['consent_get_involved_activation_token']) {
            studyInterest.set('activationToken', studyInterestObject['consent_get_involved_activation_token']);
        }
    
        if(studyInterestObject['consent_get_involved_formal_trial']) {
            studyInterest.set('formalTrial', studyInterestObject['consent_get_involved_formal_trial'] == "true");
        }
    
        if(studyInterestObject['consent_get_involved_smartphone_type']) {
            studyInterest.set('smartphoneType', studyInterestObject['consent_get_involved_smartphone_type']);
        }
    
        if(studyInterestObject['consent_get_involved_study']) {
            studyInterest.set('study', studyInterestObject['consent_get_involved_study'] == "true");
        }
    
        if(studyInterestObject['consent_get_involved_study_token']) {
            studyInterest.set('studyToken', studyInterestObject['consent_get_involved_study_token']);
        }
    
        const studyInterestACL = new Parse.ACL();
        studyInterestACL.setPublicReadAccess(false);
        studyInterest.setACL(studyInterestACL);
        let studyInterestSave = await studyInterest.save({},{useMasterKey: true});
        console.log(studyInterest);
        console.log(studyInterestSave);
        return studyInterestSave;
    } catch(e) {
        console.log(e);
    }
}

exports.sendUserStartEmail = async (selectedStudyInterest) => {
    selectedStudyInterest.map(studyInterest => {
        this.SendStartEmail(studyInterest.get("email")).then(async (result) => {
            if (!result) {
                console.log('Error connecting to server')
            }
            const UserStudyEmail = Parse.Object.extend("UserStudyEmail");
            const userStudyEmail = new UserStudyEmail();
            userStudyEmail.set('studyInterest', studyInterest);
            const userStudyEmailACL = new Parse.ACL();
            userStudyEmailACL.setPublicReadAccess(false);
            userStudyEmail.setACL(userStudyEmailACL);
            await userStudyEmail.save();
        }).catch(err => {
            console.log('Error sending to ' + studyInterest.get("email"));
            console.log(err);
        })
    })
}

exports.SendStartEmailTest = async (email) => {
    if(email == null || email == '') {
        return false;
    }
    const StudyInterest = Parse.Object.extend("StudyInterest");
    const query = new Parse.Query(StudyInterest);
    query.equalTo("email", email);
    const queryResult = await query.find({useMasterKey: true});

    console.log(queryResult);

    if(queryResult.length != 0) {
        let first = queryResult[0];

        let data = {
            email: first.get("email"),
            smartphoneType: first.get("smartphoneType"),
            studyToken: first.get("studyToken"),
            link: first.get("smartphoneType") == "android" ? "https://play.google.com/store/apps/details?id=band.cue.app" : "no link"
        };

        console.log(data);

        return true;
    } 
}


exports.SentTokenToPublic = async () => {
    
    const Token = Parse.Object.extend("Token");
    const query = new Parse.Query(Token);
    query.limit(5000);
    const queryResult = await query.find({useMasterKey: true});
    console.log(queryResult);


    for(let element of queryResult) {
        const tokenObjectACL = new Parse.ACL();
        tokenObjectACL.setPublicReadAccess(true);
        element.setACL(tokenObjectACL);
        let result = await element.save({}, {useMasterKey: true});
        console.log(result);
    }

}


exports.SendStartEmail = async(email) => {
   
    if(email == null || email == '') {
        return false;
    }
    const StudyInterest = Parse.Object.extend("StudyInterest");
    const query = new Parse.Query(StudyInterest);
    query.equalTo("email", email);
    const queryResult = await query.find({useMasterKey: true});

    console.log(queryResult);

    if(queryResult.length != 0) {
        let first = queryResult[0];

        let data = {
            email: first.get("email"),
            smartphoneType: first.get("smartphoneType"),
            studyToken: first.get("studyToken"),
            link: first.get("smartphoneType") == "android" ? "https://play.google.com/store/apps/details?id=band.cue.app" : "no link"
        };

        const result = await Parse.Cloud.run("sendStudyStartEmail", data, {useMasterKey: true});

        console.log(result);

        return result.code == 200;
    } 

}

const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

exports.ResetStudyTokens = async() => {

    const StudyInterest = Parse.Object.extend("StudyInterest");
    const query = new Parse.Query(StudyInterest);
    query.limit(1000);
    query.equalTo("activated", true);
    const queryResult = await query.find({useMasterKey: true});

    console.log(queryResult.length);

    for(let studyInterest of queryResult) {
        let studyToken = studyInterest.get('studyToken');
        console.log(studyToken);
        if(studyToken == null) {
            continue;
        }

        if(isNaN(studyToken)) {

            let tokenString  = null;
            let tokenExists = true;
            while(tokenExists) {
              tokenString = `${randomIntFromInterval(100000, 999999)}`;
              const query = new Parse.Query("Token");
              query.equalTo("token", tokenString);
              query.limit(1000);
              const results = await query.find({useMasterKey: true});
              tokenExists = results.length != 0
            }
          
            const Token = Parse.Object.extend("Token");
            const tokenObject = new Token();
          
            const tokenObjectACL = new Parse.ACL();
            tokenObjectACL.setPublicReadAccess(false);
            tokenObject.setACL(tokenObjectACL);
            tokenObject.set("token", tokenString);
            const numberOfDaysUntilExpire = 7
            const expireDate = new Date(); 
            expireDate.setDate(expireDate.getDate() + numberOfDaysUntilExpire);
            tokenObject.set("expireDate", expireDate);
          
            await tokenObject.save({}, {useMasterKey: true});
        
            
            studyInterest.set('studyToken', tokenString);

            studyInterest.save({}, {useMasterKey: true});

    
        }

    }

    console.log("done");

}

exports.HideStringOnAddress = async() => { 

    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.equalTo("trackingCode", null);
    query.limit(1000);
    const results = await query.find({useMasterKey: true});

    results.forEach(element => {
        const DeviceOrderSchemaACL = new Parse.ACL();
        DeviceOrderSchemaACL.setPublicReadAccess(false);
        element.setACL(DeviceOrderSchemaACL);
        element.save({}, {useMasterKey: true});
    });

    console.log("done");

}

exports.GetEmailsAddressFromPeopleWithNullTrackingCode = async() => {


    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.equalTo("trackingCode", null);
    query.limit(1000);
    const results = await query.find({useMasterKey: true});


    for (const element of results) {
        var user = element.get('user');
    
        const StudyData = Parse.Object.extend("StudyData");
        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo('user', user);
        const results2 = await queryStudyData.find({useMasterKey: true});

        console.log(results2[0].get('insertTokenEmail'));
    }

    console.log(results.length);
    

}

exports.Test = async() => {

    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.equalTo("user", "CCGlM7KPWU");
    query.limit(1000);
    const results = await query.find();


    console.log(results);

    

}

exports.ResetPassword = async(email) => {
    try {
        const User = Parse.Object.extend("User");
        const query = new Parse.Query(User);
        query.equalTo("email", email.trim());
        const queryResults = await query.find();
    
        if(queryResults.length == 0) {
            return {success: false, error: "E-mail not found"};
        }

        await Parse.User.requestPasswordReset(email);
        return {success: true};
        
    } catch(e) {
        return {success: false, error: e};
    }
}


exports.TestResetPassword = async() => {
    var result = await Parse.User.requestPasswordReset();
   console.log(result);
    console.log("done");
}


exports.LogInTest = async () => {
    var result  = await Parse.User.logIn("lapc19@hotmail.com", "Test1111");
    console.log(result);
}

exports.SendNotAcceptedEmail = async(email) => {
    const result = await Parse.Cloud.run("sendNotAcceptedEmail", {email}, {useMasterKey: true});
    return result.code == 200;
}

exports.GetPostCodeInfo = async(postcode) => {
    var response =  await fetch(`http://api.postcodes.io/postcodes/${postcode}`);
    if (!response.ok) {
        throw new Error(await response.text());
    }
        
    var result = await response.json();
    return result;
}

exports.CreateReport = async() => {

    var studyDatas = await this.GetStudyData();

    console.log(studyDatas.length);

    //Branch Data
    var onTrialBranch = studyDatas.filter((element) => element.get('studyBranch') == "Trial");
    var numberOfParticipantsOnTrial = onTrialBranch.length;
    console.log("onTrialBranch: " + numberOfParticipantsOnTrial);

    var onFreeLivingBranch = studyDatas.filter((element) => element.get('studyBranch') == "FreeLiving");
    var numberOfParticipantsOnFreeLiving = onFreeLivingBranch.length;
    console.log("onFreeLivingBranch: " + numberOfParticipantsOnFreeLiving);

    var onTrialToFreeLivingBranch = studyDatas.filter((element) => element.get('studyBranch') == "FreeLivingFromTrial");
    var numberOfParticipantsOnTrialToFreeLiving = onTrialToFreeLivingBranch.length;
    console.log("onTrialToFreeLiving: " + numberOfParticipantsOnTrialToFreeLiving);

    var onNoStudyBranch = studyDatas.filter((element) => element.get('studyBranch') == "NoStudy");
    var numberOfParticipantsOnNoStudy = onNoStudyBranch.length;
    console.log("onNoStudyBranch: " + numberOfParticipantsOnNoStudy);

    var onNoneBranch = studyDatas.filter((element) => element.get('studyBranch') == "None");
    var numberOfParticipantsOnNone = onNoneBranch.length;
    console.log("onNoneBranch: " + numberOfParticipantsOnNone);

    const participantsSum = numberOfParticipantsOnTrial + numberOfParticipantsOnFreeLiving + numberOfParticipantsOnTrialToFreeLiving + numberOfParticipantsOnNoStudy + numberOfParticipantsOnNone;

    console.log("Total:" + (participantsSum));

    let branchData = {
        numberOfParticipants: studyDatas.length,
        numberOfParticipantsOnTrial,
        numberOfParticipantsOnFreeLiving,
        numberOfParticipantsOnTrialToFreeLiving,
        numberOfParticipantsOnNoStudy,
        numberOfParticipantsOnNone,
        numberOfParticipantsSum: participantsSum,
    }

    //Study Stage Data
    
    const studyStages = [
        "AppStartedFirstTime",
        "InterestedInParticipating",
        "GiveConsent",
        "InsertToken",
        "SelectBranches",
        "CreateAccount",
        "PartialAssessment",
        "WaitingForBranchApproval",
        "AskDeliveryInfo",
        "WaitingForDevice",
        "Assessment1",
        "CreateSchedule",
        "SetCueingSettings",
        "CueingMethod1",
        "Assessment2",
        "WashoutPeriod",
        "Assessment3",
        "CueingMethod2",
        "Assessment4",
        "PostStudy",
        "NoStudy",
        "FreeLiving",
        "FailedBluetoothUpdateForStudyStage",
    ]

    let numberPerStudyStagesTrial = [];
    for(let studyStage of studyStages) {
        let onStudyStage = onTrialBranch.filter((element) => element.get('currentState') == studyStage);
        numberPerStudyStagesTrial[studyStage] = onStudyStage.length;
    }

    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("previousState", "PostStudy");
    const usersEndedStudy2 = await queryStudyData2.find({useMasterKey: true});
    numberPerStudyStagesTrial['PostStudy'] += usersEndedStudy2.length;
    
    console.log("Study Stages: Trial");
    console.table(numberPerStudyStagesTrial);

    let totalStagesTrial = 0;
    for(let n in numberPerStudyStagesTrial) {
        totalStagesTrial += numberPerStudyStagesTrial[n];
    }
    console.log("Total", totalStagesTrial);
    numberPerStudyStagesTrial["Total"] = totalStagesTrial;

    let numberPerStudyStagesFreeLiving = [];
    for(let studyStage of studyStages) {
    
        let onStudyStage = onFreeLivingBranch.filter((element) => element.get('currentState') == studyStage);
        numberPerStudyStagesFreeLiving[studyStage] = onStudyStage.length;
    }
    console.log("Study Stages: FreeLiving");
    console.table(numberPerStudyStagesFreeLiving);
    let totalStagesFreeLiving= 0;
    for(let n in numberPerStudyStagesFreeLiving) {
        totalStagesFreeLiving += numberPerStudyStagesFreeLiving[n];
    }
    console.log("Total", totalStagesFreeLiving);
    numberPerStudyStagesFreeLiving["Total"] = totalStagesFreeLiving;

    //Consents Trial
    let trialConsent = [];

    
    for(let trialStudyData of onTrialBranch) {
        let consentKey = trialStudyData.get("giveConsentKey");
        var consents = await this.GetConsent(consentKey);
        if(consents.length != 0) {
            trialConsent.push(consents[0]);
        }
    }
    console.log("Trial consents:", trialConsent.length);

    //Consents FreeLiving

    let freeLivingConsent = []
    
    for(let trialStudyData of onFreeLivingBranch) {
        let consentKey = trialStudyData.get("giveConsentKey");
        var consentsTemp = await this.GetConsent(consentKey);
        if(consentsTemp.length != 0) {
            freeLivingConsent.push(consents[0]);
        }
    }
    console.log("FreeLiving consents:", freeLivingConsent.length);
    let consent = [
        ["Trial", trialConsent.length],
        ["Free Living", freeLivingConsent.length]
    ]



    //Device Types
    let onAndroid = onTrialBranch.filter((element) => element.get('selectBranchesPlatform') == "Android").length;
    console.log("Trial - Android Devices", onAndroid);
    
    let onIOS = onTrialBranch.filter((element) => element.get('selectBranchesPlatform') == "iOS").length;
    console.log("Trial - iOS Devices", onIOS);
    console.log("Trial Devices Total:", onAndroid+onIOS);

    let trialDevices = [
        ["Android", onAndroid],
        ["iOS", onIOS],
        ["Total", onAndroid+onIOS]
    ];

    let onAndroidFL = onFreeLivingBranch.filter((element) => element.get('selectBranchesPlatform') == "Android").length;
    console.log("FreeLiving - Android Devices", onAndroidFL);
    
    let onIOSFL = onFreeLivingBranch.filter((element) => element.get('selectBranchesPlatform') == "iOS").length;
    console.log("FreeLiving - iOS Devices", onIOSFL);
    console.log("FreeLiving Devices Total:", onAndroidFL+onIOSFL);

    let freeLivingDevices = [
        ["Android", onAndroidFL],
        ["iOS", onIOSFL],
        ["Total", onAndroidFL+onIOSFL]
    ];

    let studyDataParticipants = onTrialBranch.concat(onFreeLivingBranch);

    //Postcode Region
    let postcodeInfoRegionsResult = await this.GetPostcodeInfoRegions(studyDataParticipants);

    let diaryDayStats = []//await this.getDiaryInfo();

    await generateStudyReport(branchData, numberPerStudyStagesTrial, numberPerStudyStagesFreeLiving, trialDevices, freeLivingDevices, postcodeInfoRegionsResult.participantsByCountry, postcodeInfoRegionsResult.participantByCounty, postcodeInfoRegionsResult.participantByRegion, consent, diaryDayStats);
}


const generateStudyReport = async (branchData, studyStagesDataTrial, studyStagesDataFreeLiving, trialDevices, freeLivingDevices, participantsByCountry, participantsByCounty, participantsByRegion, consentData, diaryDayStats) => {
    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: 'a4'
        });

        let x = 14;
        let y = 10;
        doc.setFontSize(25);
        doc.text(`Cue Band Study Report`, x, y);

        y += 8;
        doc.setFontSize(15);
        doc.text(`${new Date()}`, x, y);

        y += 15;
        doc.setFontSize(20);
        doc.text("Branch Data:", x, y);

        y += 7;
        doc.setFontSize(12);
        doc.text(`Total Participants: ${branchData.numberOfParticipants}`, x, y);

        y += 7;
        doc.autoTable({
            startY: y,
            head: [['Branch', 'Number']],
            body: [
                ['Trial', branchData.numberOfParticipantsOnTrial],
                ['Free Living', branchData.numberOfParticipantsOnFreeLiving],
                ['Trial to Free Living', branchData.numberOfParticipantsOnTrialToFreeLiving],
                ['Not In Study', branchData.numberOfParticipantsOnNoStudy],
                ['Not allocated', branchData.numberOfParticipantsOnNone],
                ['Total', branchData.numberOfParticipantsSum],
            ]
        });

        y += 70;
        doc.setFontSize(20);
        doc.text("Study Stages: Trial", x, y);

        const studyStagesDataTrialMap = [];
        for(let studyStagesData in studyStagesDataTrial) {
            studyStagesDataTrialMap.push([studyStagesData ,studyStagesDataTrial[studyStagesData]]);
        }
        y += 8;
        doc.autoTable({
            startY: y,
            head: [['Study Stage', 'Number']],
            body: studyStagesDataTrialMap
        });

        y += 0;
        doc.setFontSize(20);
        doc.text("Study Stages: Free Living", x, y);

        const studyStagesDataFreeLivinglMap = [];
        for(let studyStagesData in studyStagesDataFreeLiving) {
            studyStagesDataFreeLivinglMap.push([studyStagesData, studyStagesDataFreeLiving[studyStagesData]]);
        }
        y += 8;
        doc.autoTable({
            startY: y,
            head: [['Study Stage', 'Number']],
            body: studyStagesDataFreeLivinglMap
        });

        y += 1;
        doc.setFontSize(20);
        doc.text("Devices", x, y);

        y += 9;
        doc.setFontSize(12);
        doc.text("Trial", x, y);

        y += 3;
        doc.autoTable({
            startY: y,
            head: [['Device Type', 'Number']],
            body: trialDevices
        });

        y += 40;
        doc.setFontSize(12);
        doc.text("Free Living", x, y);

        y += 3;
        doc.autoTable({
            startY: y,
            head: [['Device Type', 'Number']],
            body: freeLivingDevices
        });

        y += 50;
        doc.setFontSize(20);
        doc.text("Consent Data", x, y);

        y += 5;
        doc.autoTable({
            startY: y,
            head: [['Branch', 'Number']],
            body: consentData
        });

        y += 50;
        doc.setFontSize(20);
        doc.text("Region Data", x, y);

        y += 9;
        doc.setFontSize(12);
        doc.text("Participants by Country", x, y);

        const participantsByCountryMap = [];
        for(let participantsByCountryElement in participantsByCountry) {
            participantsByCountryMap.push([participantsByCountryElement, participantsByCountry[participantsByCountryElement]]);
        }
        y += 5;
        doc.autoTable({
            startY: y,
            head: [['Country', 'Number']],
            body: participantsByCountryMap
        });

        y -= 100;
        doc.setFontSize(12);
        doc.text("Participants by Region/District", x, y);

        const participantByRegionMap = [];
        for(let participantsByRegionElement in participantsByRegion) {
            participantByRegionMap.push([participantsByRegionElement, participantsByRegion[participantsByRegionElement]]);
        }
        y += 5;
        doc.autoTable({
            startY: y,
            head: [['Region/District', 'Number']],
            body: participantByRegionMap
        });
   
        y += 1;
        doc.setFontSize(12);
        doc.text("Participants by County/District", x, y);

        const participantsByCountyMap = [];
        for(let participantsByCountyElement in participantsByCounty) {
            participantsByCountyMap.push([participantsByCountyElement, participantsByCounty[participantsByCountyElement]]);
        }
        y += 5;
        doc.autoTable({
            startY: y,
            head: [['County/District', 'Number']],
            body: participantsByCountyMap
        });

        y += (doc.lastAutoTable.finalY + 5);

        doc.setFontSize(12);
        doc.text("Diary Stats:", x, y);


        let frequencyList = [];
        let durationList = [];
        let severityList = [];
    
        for(let ddsKey in diaryDayStats) {
            var dds = diaryDayStats[ddsKey];
    
            frequencyList.push([
                formatDate(ddsKey),
                dds.totalValues,
                dds.frequencyAverage,
                dds.frequenctStd,
                dds.maxFrequency,
                dds.minFrequency
            ]);
    
            durationList.push([
                formatDate(ddsKey),
                dds.totalValues,
                dds.durationAverage,
                dds.durationStd,
                dds.maxDuration,
                dds.minDuration
            ]);
    
            severityList.push([
                formatDate(ddsKey),
                dds.totalValues,
                dds.severityAverage,
                dds.severityStd,
                dds.maxSeverity,
                dds.minSeverity
            ]);
        }
    
        doc.autoTable({
            head: [['Date', 'Total Values', 'Frequency Avg','Frequency Std', 'Max Frequency', 'Min Frequency']],
            body: frequencyList
        });
    
        doc.autoTable({     
            head: [['Date', 'Total Values', 'Duration Avg','Duration Std', 'Max Duration', 'Min Duration']],
            body: durationList
        });
    
        doc.autoTable({
        
            head: [['Date', 'Total Values', 'Severity Avg','Severity Std', 'Max Severity', 'Min Severity']],
            body: severityList
        });
    
        doc.save('studyReport.pdf');  
        doc.output('blob');

    } catch (err) {
      console.log(err);
      return;
    }
  }



exports.GetPostcodeInfoRegions = async(studyDatas) => {

    var postcodes = [];

    for(let studyData of studyDatas) {
        var userId = studyData.get("user").id;
        console.log(userId);
        const DeliveryAddress = Parse.Object.extend("DeliveryAddress");
        const addressQuery = new Parse.Query(DeliveryAddress);
        addressQuery.equalTo("user", userId);
        const results = await addressQuery.find({useMasterKey: true});
        if(results.length > 0) {
            postcodes.push(results[0].get("postcode"));
        }
    }

    console.log(postcodes);

    let postcodeInfos = [];
    for(let postcode of postcodes) {
        var postcodeInfo = await this.GetPostCodeInfo(postcode);
        var info = {
            county: postcodeInfo.result["admin_county"],
            region: postcodeInfo.result["region"],
            district: postcodeInfo.result["admin_district"],
            country: postcodeInfo.result["country"],
        };

        postcodeInfos.push(info);
        console.log(info);
        await delay(500);
    }

    var participantsByCountry = [];
    let participantByCounty = [];
    let participantByRegion = [];

    for(let postcodeInfo of postcodeInfos) { 
        if(postcodeInfo.country in participantsByCountry) {
            participantsByCountry[postcodeInfo.country] += 1;
        } else {
            participantsByCountry[postcodeInfo.country] = 1;
        }

        if(postcodeInfo.county != null) {
            if(postcodeInfo.county in participantByCounty) {
                participantByCounty[postcodeInfo.county] += 1;
            } else {
                participantByCounty[postcodeInfo.county] = 1;
            }
        } else {
            if(postcodeInfo.district in participantByCounty) {
                participantByCounty[postcodeInfo.district] += 1;
            } else {
                participantByCounty[postcodeInfo.district] = 1;
            }
        }

        if(postcodeInfo.region != null) {
            if(postcodeInfo.region in participantByRegion) {
                participantByRegion[postcodeInfo.region] += 1;
            } else {
                participantByRegion[postcodeInfo.region] = 1;
            }
        } else {
            if(postcodeInfo.district in participantByRegion) {
                participantByRegion[postcodeInfo.district] += 1;
            } else {
                participantByRegion[postcodeInfo.district] = 1;
            }
        }

    }
    console.table(participantsByCountry);
    console.table(participantByCounty);
    console.table(participantByRegion);

    return {participantsByCountry, participantByCounty, participantByRegion};
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}


exports.getDiaryInfo = async() => {


    const DiaryEntry = Parse.Object.extend("DiaryEntry");
    const diaryEntryQuery = new Parse.Query(DiaryEntry);
    diaryEntryQuery.limit(5000);
    const results = await diaryEntryQuery.find({useMasterKey: true});

    let diaryEntryByDate = {};
   
    for(let diaryEntry of results) {

        var nulls = [];

        var date = diaryEntry.get("dayDate");

        if(date == null) {
            nulls.push(diaryEntry);
            continue;
        }

        if(date in diaryEntryByDate) {
            let dateByDiaryEntries = diaryEntryByDate[date];
            dateByDiaryEntries.push(diaryEntry);
            diaryEntryByDate[date] = dateByDiaryEntries;
        } else {
            diaryEntryByDate[date] = [diaryEntry];
        }

    }


    var diaryDayStats = {};

    for (const dateKey in diaryEntryByDate) {
     
        var frequencySum = 0;
        var durationSum = 0;
        var severitySum = 0;
        var totalValues = 0;

        var minFrequency = Number.MAX_VALUE; 
        var maxFrequency = Number.MIN_VALUE;
        var minDuration = Number.MAX_VALUE; 
        var maxDuration = Number.MIN_VALUE;
        var minSeverity = Number.MAX_VALUE; 
        var maxSeverity = Number.MIN_VALUE;

        var frequencyAverage = 0;
        var durationAverage = 0;
        var severityAverage = 0;

        var frequencyValues = [];
        var durationValues = [];
        var severityValues = [];
        
        let diaryEntryDate = diaryEntryByDate[dateKey];
        totalValues = diaryEntryDate.length;
        for(let de of diaryEntryDate) {
            
            frequencyValues.push(de.get("frequency"));
            durationValues.push(de.get("duration"));
            severityValues.push(de.get("severity"));

            frequencySum += de.get("frequency");
            durationSum += de.get("duration");
            severitySum += de.get("severity");
            
            if(de.get("frequency") < minFrequency) {
                minFrequency = de.get("frequency");
            }

            if(de.get("frequency") > maxFrequency) {
                maxFrequency = de.get("frequency");
            }

            if(de.get("duration") < minDuration) {
                minDuration = de.get("duration");
            }

            if(de.get("duration") > maxDuration) {
                maxDuration = de.get("duration");
            }

            if(de.get("severity") < minSeverity) {
                minSeverity = de.get("severity");
            }

            if(de.get("severity") > maxSeverity) {
                maxSeverity = de.get("severity");
            }
        }

        frequencyAverage = frequencySum / totalValues;
        durationAverage = durationSum / totalValues;
        severityAverage = severitySum / totalValues;
    
        var frequenctStd = math.std(frequencyValues);
        var durationStd = math.std(durationValues);
        var severityStd = math.std(severityValues);

        var dayStats = {
            totalValues,
            frequencyAverage,
            durationAverage,
            severityAverage,
            frequenctStd,
            durationStd,
            severityStd,
            maxFrequency,
            minFrequency,
            maxDuration,
            minDuration,
            maxSeverity,
            minSeverity,
        };

        diaryDayStats[dateKey] = dayStats;
    }

 

    console.table(diaryDayStats);

    return diaryDayStats;
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}




exports.GenerateConsentReport = async () => {

    const ConsenReport = Parse.Object.extend("ConsentReport");
    const consenReportQuery = new Parse.Query(ConsenReport);
    consenReportQuery.limit(5000);
    const consenReportResults = await consenReportQuery.find({useMasterKey: true});
    
    console.log(consenReportResults);

    let lastReportDate = new Date(0,0,0);
    if(consenReportResults.length > 0) {
        for (let index = 0; index < consenReportResults.length; index++) {   
            if(consenReportResults[index].get("endDate") > lastReportDate) {
                lastReportDate = consenReportResults[index].get("endDate");
            } 
        }
    }

    console.log(lastReportDate);


    console.log("Generating Report");

    const Consent = Parse.Object.extend("Consent");
    const query = new Parse.Query(Consent);
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    

    var realConsents = [];

    for(const result of results) {

        //console.log(result.get("createdAt"), lastReportDate);

        if(result.get("createdAt") < lastReportDate){
            continue
        }


        var token = result.get("token");
        const StudyData = Parse.Object.extend("StudyData");
        const studyDataQuery = new Parse.Query(StudyData);
        studyDataQuery.equalTo("giveConsentKey", token);
        const studyDatas = await studyDataQuery.find({useMasterKey: true});
    
        if(studyDatas.length != 0) {
            realConsents.push([result, studyDatas[0]]);
        }
        
    }
    
    //console.log(empty);
    //console.log(results.length);
    //console.log(realConsents.length);

    const names = {};

    for(const [rc, sd] of realConsents) {
        var name = rc.get("name").trim();
        name = name.replaceAll("  ", " ");
        
        if(name in names) {
            names[name].push([rc,sd]);
        } else {
            names[name] = [[rc,sd]];
        }
    }

    const filted = {};
    for(const name in names) {
        if(names[name].length > 1) {
            filted[name] = names[name];

            names[name] = [names[name][0]];

        }
    }

    
    console.log(filted);

    console.log(names);
    console.log(Object.keys(names).length);

    if(Object.keys(names).length == 0) {
        return;
    }

    await formatAndStoreConsentForm(names);
}

/*
const userIsTheSame = async (studyDataId1, studyDataId2) => {

    console.log(studyDataId1, studyDataId2)

    //check if contact email is the same
    const StudyData = Parse.Object.extend("StudyData");
    const query = new Parse.Query(StudyData);
    query.equalTo("objectId", studyDataId1)
    const results = await query.find({useMasterKey: true});
    return results;



    //check which was created first and updated last

    //check address to know if same

    //check if name in consent is the same.
    
    //check if login types are the same

    //check if device and os are the same




} */



const formatAndStoreConsentForm = async (consentQueryResult) => {

    var dataForCSV = [];

    let ealiestDate = new Date(9999,1,1);

    for (const name in consentQueryResult) {
        if (!Object.hasOwnProperty.call(consentQueryResult, name)) {
            continue;
        }

        const [consentData, studyData] = consentQueryResult[name][0];

        let studyBranch = studyData.get("studyBranch");
        console.log(studyBranch,  consentQueryResult[name][0], name)

        if(consentData.get("createdAt") < ealiestDate) {
            ealiestDate = consentData.get("createdAt");
        }


        if(studyBranch == "NoStudy") {
            const LeftStudyQuery = new Parse.Query("LeftStudy")
            LeftStudyQuery.equalTo("user", studyData.get("user"));
            const leftStudyResult = await LeftStudyQuery.find({useMasterKey:true});
        
            if(leftStudyResult.length > 0) {
                studyBranch = leftStudyResult[0].get("studyBranch");
            } else {
                continue;
            }
            
        } else if(studyBranch == "FreeLivingFromTrial") {
            studyBranch = "FreeLiving";
        }


        var consentId = consentData.get("participantReference");
        consentId = consentId.replaceAll("undefined", "");

        const userData = {
            name: consentData.get("name"),
            id: consentId,
            consentFormFilledDate: consentData.get("createdAt"),
            studyBranch
        };
      
        const token = consentData.get("token");
        const demographicsDataQuery = new Parse.Query("DemographicsData")
        demographicsDataQuery.equalTo("token", token);
        const demographicsDataQueryResult = await demographicsDataQuery.find({useMasterKey:true});
        if(demographicsDataQueryResult.length == 0) {
            userData['YearOfBirth'] = "Demographics data not found";
        } else {
        const ageRange = demographicsDataQueryResult[0].get("ageRange");
        if(ageRange == null) {
            userData['YearOfBirth'] = "Not disclosed by participant";
        }
        const ageRangeString = ageRange.substring(0,2);
            userData['YearOfBirth'] = isNaN(ageRangeString) ? "Not disclosed by participant" : new Date().getFullYear() - Number(ageRangeString);
        }
        dataForCSV.push(userData);
    }

    let csvContent = "Id,Name,YearOfBirth,ConsentFormFilledDate,StudyBranch\n"
    dataForCSV.forEach(data => {
      csvContent += `${data.id},${data.name},${data.YearOfBirth},${data.consentFormFilledDate},${data.studyBranch}\n`
    });

    const currentDate = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(currentDate);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
  
    const randomFileName = randomBytes(16).toString("hex");
    const filename = `ParticipantReport${da}${mo}${ye}.${randomFileName}.csv`;
    const file = new Parse.File(filename, {base64: Buffer.from(csvContent).toString('base64')});
    
    try {
      var saveFileResult = await file.save();
      if(saveFileResult.code != null) {
        return;
      }
  
      console.log(file.url());
      console.log("The file has been saved to Parse.")
      const ConsentReport = Parse.Object.extend("ConsentReport");
      const consentReportObject = new ConsentReport();
  
      const consentReportObjectACL = new Parse.ACL();
      consentReportObjectACL.setPublicReadAccess(false);
  
      consentReportObject.setACL(consentReportObjectACL);
      consentReportObject.set("startDate", ealiestDate);
      consentReportObject.set("endDate", new Date());
      consentReportObject.set("csvFile", file);
      await consentReportObject.save({}, {useMasterKey:true});
  
  
      return consentReportObject;
  
    } catch(e) {
      console.log("The file either could not be read, or could not be saved to Parse.", e)
    }
}

exports.SetAdminRoleAgain = async () => {

    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo("name", "Admin");
    const roleQueryResults = await roleQuery.find({ useMasterKey: true });
    const adminRole = roleQueryResults[0];

    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("username", "zreJNjQGKjwk6h5p");
    const userQueryResults = await userQuery.find({ useMasterKey: true });
    const user = userQueryResults[0];

    adminRole.getUsers().add(user);
    adminRole.save({ useMasterKey: true });
}

const getAssessmentData = async (assessmentKey) => {
    const Assessment = Parse.Object.extend("Assessment");
    const query = new Parse.Query(Assessment);
    query.equalTo("token", assessmentKey);
    const results = await query.find({useMasterKey: true});
    return results;
}
 
const getAppLogs = async(user) => {
    const AppLog = Parse.Object.extend("AppLog");
    const query = new Parse.Query(AppLog);
    query.equalTo("user", user);
    query.limit(1000);
    const results = await query.find({useMasterKey: true});
    return results;
}

const getActivityLogBlockHeaders = async (user) => {

    const ActivityLogBlockHeader = Parse.Object.extend("ActivityLogBlockHeader");
    const queryActivityLogBlockHeader = new Parse.Query(ActivityLogBlockHeader);
    queryActivityLogBlockHeader.equalTo("user", user);
    const count = await queryActivityLogBlockHeader.count({useMasterKey: true});

    const numberOfPages = Math.ceil(count / 1000);

    let userActivityLogBlockHeader = [];
    for(let i = 0; i < numberOfPages; i++) {
        const queryActivityLogBlockHeader = new Parse.Query(ActivityLogBlockHeader);
        queryActivityLogBlockHeader.equalTo("user", user);
        queryActivityLogBlockHeader.limit(1000);
        queryActivityLogBlockHeader.skip(i * 1000);
        const userActivityLogBlockHeaderPage = await queryActivityLogBlockHeader.find({useMasterKey: true});
        userActivityLogBlockHeader = userActivityLogBlockHeader.concat(userActivityLogBlockHeaderPage);
    }

    return userActivityLogBlockHeader;
}


const getActivityLogBlockSamples = async (user) => {

    const ActivityLogBlockSample = Parse.Object.extend("ActivityLogBlockSample");
    const queryActivityLogBlockSample = new Parse.Query(ActivityLogBlockSample);
    queryActivityLogBlockSample.equalTo("user", user);
    const count = await queryActivityLogBlockSample.count({useMasterKey: true});

    const numberOfPages = Math.ceil(count / 1000);

    console.log(count, numberOfPages);

    let userActivityLogBlockSample = [];
    for(let i = 0; i < numberOfPages; i++) {
        const queryActivityLogBlockSample = new Parse.Query(ActivityLogBlockSample);
        queryActivityLogBlockSample.equalTo("user", user);
        queryActivityLogBlockSample.limit(1000);
        queryActivityLogBlockSample.skip(i * 1000);
        const userActivityLogBlockSamplePage = await queryActivityLogBlockSample.find({useMasterKey: true});
        console.log(userActivityLogBlockSamplePage);
        userActivityLogBlockSample = userActivityLogBlockSample.concat(userActivityLogBlockSamplePage);
    }

    return userActivityLogBlockSample;
}

const download = async (content, fileName, contentType) => {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(content)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


exports.GetSamplesFromUsersOnFreeLiving = async () => {

    const ignoreUsers = ['54hFUuEnJA', 'KpZ0DlA0Qa', 'gymn4uQetH', 'JqZPr3q1LD', 'CCGlM7KPWU', 
    'T00mMEwEZQ', 'vyXgu5Y2Ir', 'M6AnBk7QDC', 'D9ueoHithb', 'yA5oo0mfBh', 
    'qIbpO14xtQ', 'tQH2goO6X7', 'qehDXrIutg', 'IH37N8bmqr', 'x5FkDfHIeb', 
    'QOQ0hkp1w8', 'bNC0L6XLKF', 'eos78kZgv7', '1r2J9taZha', 'RCyHQ6rpvv', 
    '7YEwUZuc8D', 'FhOlzVfEIL', 'AfV9dmJtMm', 'HEUjBr7iWG', 'PN1zc7wTMT', 
    'ILi5G9vycp', 'hWKgqVxmMM', 'vvRWUiYuo0', 'YQ5JZShUmU', 'TD9pplcD4k', 
    '0tbGZHzjR7', 'NB01kHhAKl', '6Ujss5DCym', 'FhEb2UWpsc', 'lkEP97xGWa', 
    'vmFt8cc4jE', 'WcSXVvGRh1', 'yHK1hn0pTA', 'Bigvbc0mbI', 'tMpBFEEHKj', 
    '2dbVKUDzd5', '3kRR5MPMyj', 'BzirdGuQ3W', 'PAsFOF8cXY', 'xwF8hGon4W', 
    'AkZCK3y8qH', 'mkxN5gMcg2'];

    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("studyBranch", "FreeLiving");
    //queryStudyData.equalTo("currentState", "FreeLiving");
    const usersEndedStudy = await queryStudyData.find({useMasterKey: true});

    /*
    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("previousState", "PostStudy");
    const usersEndedStudy2 = await queryStudyData2.find({useMasterKey: true});
    */

    let listAllUsers = usersEndedStudy//usersEndedStudy.concat(usersEndedStudy2);
    //console.log("listAllUsers", listAllUsers);

    let users = listAllUsers.map(result => result.get("user"));
    console.log("users", users.length);

    
    if(ignoreUsers.length > 0) {
        users = users.filter(user => !ignoreUsers.includes(user.id));
    }

    console.log("user filtered", users.length);

    for(const user of users) {

        console.log(user.id);

        var samples = await getActivityLogBlockSamples(user);

        var userData = {
            user: user.id,
            samples: samples
        }

        download(userData, `${user.id} Samples.json`, 'application/json');
    }

   
}

exports.GetDataOfUsersThatFinishedByUser = async () => {

    
    const ignoreUsers = ['54hFUuEnJA', 'KpZ0DlA0Qa', 'gymn4uQetH', 'JqZPr3q1LD', 'CCGlM7KPWU', 
    'T00mMEwEZQ', 'vyXgu5Y2Ir', 'M6AnBk7QDC', 'D9ueoHithb', 'yA5oo0mfBh', 
    'qIbpO14xtQ', 'tQH2goO6X7', 'qehDXrIutg', 'IH37N8bmqr', 'x5FkDfHIeb', 
    'QOQ0hkp1w8', 'bNC0L6XLKF', 'eos78kZgv7', '1r2J9taZha', 'RCyHQ6rpvv', 
    '7YEwUZuc8D', 'FhOlzVfEIL', 'AfV9dmJtMm', 'HEUjBr7iWG', 'PN1zc7wTMT', 
    'ILi5G9vycp', 'hWKgqVxmMM', 'vvRWUiYuo0', 'YQ5JZShUmU', 'TD9pplcD4k', 
    '0tbGZHzjR7', 'NB01kHhAKl', '6Ujss5DCym', 'FhEb2UWpsc', 'lkEP97xGWa', 
    'vmFt8cc4jE', 'WcSXVvGRh1', 'yHK1hn0pTA', 'Bigvbc0mbI', 'tMpBFEEHKj', 
    '2dbVKUDzd5', '3kRR5MPMyj', 'BzirdGuQ3W', 'PAsFOF8cXY', 'xwF8hGon4W', 
    'AkZCK3y8qH', 'mkxN5gMcg2'];

    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("studyBranch", "FreeLiving");
    //queryStudyData.equalTo("currentState", "FreeLiving");
    const usersEndedStudy = await queryStudyData.find({useMasterKey: true});

    /*
    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("previousState", "PostStudy");
    const usersEndedStudy2 = await queryStudyData2.find({useMasterKey: true});
    */

    let listAllUsers = usersEndedStudy//usersEndedStudy.concat(usersEndedStudy2);
    //console.log("listAllUsers", listAllUsers);

    let users = listAllUsers.map(result => result.get("user"));
    console.log("users", users.length);

    
    if(ignoreUsers.length > 0) {
        users = users.filter(user => !ignoreUsers.includes(user.id));
    }

    console.log("user filtered", users.length);

 

    /*
    const assessmentKeys = listAllUsers.map(result => {
        return {
            userId: result.get("user").id,
            assessment1Key : result.get("assessment1Key"), 
            assessment2Key : result.get("assessment2Key"),
            assessment3Key : result.get("assessment3Key"),
            assessment4Key : result.get("assessment4Key"),}
         ;
    });

    console.log(assessmentKeys);*/

    console.log(users);

    const resultUsers = {}

    for(const user of users) {
        console.log(user.id);

        //Diary Entry
        const DiaryEntry = Parse.Object.extend("DiaryEntry");
        const queryDiaryEntry = new Parse.Query(DiaryEntry);
        queryDiaryEntry.equalTo("user", user);
        queryDiaryEntry.limit(5000);
        const userDiaryEntries = await queryDiaryEntry.find({useMasterKey: true});

        userDiaryEntries.forEach(diaryEntry => { 
            diaryEntry.set("user", user.id);
            diaryEntry.set("ACL", null);
        });

        resultUsers[user.id] = {};
        resultUsers[user.id]["diaryEntry"] = userDiaryEntries;

        //Cueing Interval
        const CueingInterval = Parse.Object.extend("CueingInterval");
        const queryCueingInterval = new Parse.Query(CueingInterval);
        queryCueingInterval.equalTo("user", user);
        queryCueingInterval.limit(5000);
        const userCueingInterval = await queryCueingInterval.find({useMasterKey: true});

        userCueingInterval.forEach(cueingInterval => { 
            cueingInterval.set("user", user.id);
            cueingInterval.set("ACL", null);
        });
        resultUsers[user.id]["cueingInterval"] = userCueingInterval;
    
        
        //Assessments
        /*
        const assessmentKeysForUser = assessmentKeys.find(assessmentKey => assessmentKey.userId == user.id);
        resultUsers[user.id]["assessment1Data"] = (await getAssessmentData(assessmentKeysForUser.assessment1Key))[0];
        resultUsers[user.id]["assessment2Data"] = (await getAssessmentData(assessmentKeysForUser.assessment2Key))[0];
        resultUsers[user.id]["assessment3Data"] = (await getAssessmentData(assessmentKeysForUser.assessment3Key))[0];
        resultUsers[user.id]["assessment4Data"] = (await getAssessmentData(assessmentKeysForUser.assessment4Key))[0];
        */
        
        //ActivityBlockHeaders
        const activityHeaders = await getActivityLogBlockHeaders(user);

        activityHeaders.forEach(activityHeader => {
            activityHeader.set("user", user.id);
            activityHeader.set("ACL", null);
        });
        resultUsers[user.id]["activityLogBlockHeaders"] = activityHeaders;

        //AppLogs
        const appLogs = await getAppLogs(user);
        appLogs.forEach(appLog => {
            appLog.set("user", user.id);
            appLog.set("ACL", null);
        });

        resultUsers[user.id]["appLogs"] = appLogs;


        //Demographic data

        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo("user", user.id);
        const resultStudyData = await queryStudyData.first({useMasterKey: true});
    
        const key = resultStudyData.get("giveConsentKey");

        const DemographicsData = Parse.Object.extend("DemographicsData");
        const queryDemographicsData = new Parse.Query(DemographicsData);
        queryDemographicsData.equalTo("token", key);
        const resultDemographicsData = await queryDemographicsData.first({useMasterKey: true});

        if(resultDemographicsData == null) {
            continue;
        }

        resultUsers[user.id]["demographicData"] = {
        "gender": resultDemographicsData.get("gender"),
        "ageRange": resultDemographicsData.get("ageRange"),
        "ethinicity": resultDemographicsData.get("ethinicity"),
        "ethnicGroup": resultDemographicsData.get("ethnicGroup"),
        "cueingMethod1": resultStudyData.get("cueingMethod1"),
        "cueingMethod2": resultStudyData.get("cueingMethod2"),
        "cueingMethod1Start": resultStudyData.get("cueingMethod1DateStarted"),
        "cueingMethod1End": resultStudyData.get("cueingMethod1DateFinished"),
        "cueingMethod2Start": resultStudyData.get("cueingMethod2DateStarted"),
        "cueingMethod2End": resultStudyData.get("cueingMethod2DateFinished")
       }
    }

    download(resultUsers, 'freeLivingParticipants.json', 'application/json');

    console.log(resultUsers.length);

}

exports.GetPeopleForInterviewQuestionnare = async () => {

    const PostStudyQuestionnaire = Parse.Object.extend("PostStudyQuestionnaire");
    const queryPostStudyQuestionnaire = new Parse.Query(PostStudyQuestionnaire);
    //queryPostStudyQuestionnaire.equalTo("question1Answer", "Yes");
    const resultPostStudyQuestionnaire = await queryPostStudyQuestionnaire.find({useMasterKey: true});

    let csvContent = "Email, Study\n"
    for(const result of resultPostStudyQuestionnaire) {
        const StudyData = Parse.Object.extend("StudyData");
        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo("user", result.get("user"));
        const resultStudyData = await queryStudyData.find({useMasterKey: true});
        csvContent += `${resultStudyData[0].get("insertTokenEmail")}, ${resultStudyData[0].get("studyBranch")}\n`;
    }

    var a = document.createElement("a");
    var file = new Blob([csvContent], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "usersForInterview.csv";
    a.click();
}

exports.GetDataFromExistingUsers = async () => {

    const ids = ['54hFUuEnJA', 'KpZ0DlA0Qa', 'gymn4uQetH', 'JqZPr3q1LD', 'CCGlM7KPWU', 
    'T00mMEwEZQ', 'vyXgu5Y2Ir', 'M6AnBk7QDC', 'D9ueoHithb', 'yA5oo0mfBh', 
    'qIbpO14xtQ', 'tQH2goO6X7', 'qehDXrIutg', 'IH37N8bmqr', 'x5FkDfHIeb', 
    'QOQ0hkp1w8', 'bNC0L6XLKF', 'eos78kZgv7', '1r2J9taZha', 'RCyHQ6rpvv', 
    '7YEwUZuc8D', 'FhOlzVfEIL', 'AfV9dmJtMm', 'HEUjBr7iWG', 'PN1zc7wTMT', 
    'ILi5G9vycp', 'hWKgqVxmMM', 'vvRWUiYuo0', 'YQ5JZShUmU', 'TD9pplcD4k', 
    '0tbGZHzjR7', 'NB01kHhAKl', '6Ujss5DCym', 'FhEb2UWpsc', 'lkEP97xGWa', 
    'vmFt8cc4jE', 'WcSXVvGRh1', 'yHK1hn0pTA', 'Bigvbc0mbI', 'tMpBFEEHKj', 
    '2dbVKUDzd5', '3kRR5MPMyj', 'BzirdGuQ3W', 'PAsFOF8cXY', 'xwF8hGon4W', 
    'AkZCK3y8qH', 'mkxN5gMcg2'];

    const result = await exports.GetDemographicData(ids);
    

    download(result, 'demographicAndStudyData.json', 'application/json');

}

exports.GetDemographicData = async (ids = null) => {
    
    const data = [];
    if(ids == null) {
        //get demorgraphic data for all users
        const DemographicsData = Parse.Object.extend("DemographicsData");
        const queryDemographicsData = new Parse.Query(DemographicsData);
        const resultDemographicsData = await queryDemographicsData.find({useMasterKey: true});
    } else {

        for(const id of ids) {
            const StudyData = Parse.Object.extend("StudyData");
            const queryStudyData = new Parse.Query(StudyData);
            queryStudyData.equalTo("user", id);
            const resultStudyData = await queryStudyData.first({useMasterKey: true});
        
            const key = resultStudyData.get("giveConsentKey");
            console.log(key);

            const DemographicsData = Parse.Object.extend("DemographicsData");
            const queryDemographicsData = new Parse.Query(DemographicsData);
            queryDemographicsData.equalTo("token", key);
            const resultDemographicsData = await queryDemographicsData.first({useMasterKey: true});

            if(resultDemographicsData == null) {
                continue;
            }

           const demographicData = {
            "userId": id,
            "gender": resultDemographicsData.get("gender"),
            "ageRange": resultDemographicsData.get("ageRange"),
            "ethinicity": resultDemographicsData.get("ethinicity"),
            "ethnicGroup": resultDemographicsData.get("ethnicGroup"),
            "cueingMethod1": resultStudyData.get("cueingMethod1"),
            "cueingMethod2": resultStudyData.get("cueingMethod2"),
            "cueingMethod1Start": resultStudyData.get("cueingMethod1DateStarted"),
            "cueingMethod1End": resultStudyData.get("cueingMethod1DateFinished"),
            "cueingMethod2Start": resultStudyData.get("cueingMethod2DateStarted"),
            "cueingMethod2End": resultStudyData.get("cueingMethod2DateFinished")
           }
           data.push(demographicData);

           console.log(demographicData)
        }

        return data;
    }
}

exports.GetFeedback = async() => {

    const AppFeedback = Parse.Object.extend("AppFeedback");
    const queryFeedback = new Parse.Query(AppFeedback);
    const result = await queryFeedback.findAll({useMasterKey: true});

    console.log(result);


    const feedback = [];
    for(const feedbackItem of result) {
        feedback.push({
            "text": feedbackItem.get("text"),
            "recordedTime": feedbackItem.get("recordedTime"),
            "rating": feedbackItem.get("rating"),
        });
    }

    download(feedback, 'feedback.json', 'application/json');
}

exports.GetHeaders = async(id) => {
    const ActivityLogBlockHeader = Parse.Object.extend("ActivityLogBlockHeader");
    const queryActivityLogBlockHeader = new Parse.Query(ActivityLogBlockHeader);
    queryActivityLogBlockHeader.equalTo("user", id);
    const result = await queryActivityLogBlockHeader.findAll({useMasterKey: true});
    console.log(result.length);
}

exports.GetPeopleThatFininishedStudy = async() => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("currentState", "PostStudy");
    const usersEndedStudy = await queryStudyData.find({useMasterKey: true});
    console.log(usersEndedStudy.length);
    
    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("previousState", "PostStudy");
    const usersEndedStudy2 = await queryStudyData2.find({useMasterKey: true});
    console.log(usersEndedStudy2.length);

    console.log("Total Users that finished study: " + (usersEndedStudy.length + usersEndedStudy2.length));
}

exports.GetPeopleWhoAreStuck = async() => {
    
    const onAskDeliveryInfo = [];
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("currentState", "AskDeliveryInfo");
    const usersEndedStudy = await queryStudyData.find({useMasterKey: true});
    console.log("Stuck on AskDeliveryInfo", usersEndedStudy.length);
    for (const studyUser of usersEndedStudy) {
        onAskDeliveryInfo.push(studyUser.get("insertTokenEmail"));
    }

    console.log(onAskDeliveryInfo);

    let csv1Content = "Emails\n";
    for (const email of onAskDeliveryInfo) {
        csv1Content += email + "\n";
    }

    var a1 = document.createElement("a");
    var file = new Blob([csv1Content], {type: 'text/csv'});
    a1.href = URL.createObjectURL(file);
    a1.download = "AskDeliveryInfoEmails.csv";
    a1.click();

    const onWaitingForDevice = [];
    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("currentState", "WaitingForDevice");
    const usersEndedStudy2 = await queryStudyData2.find({useMasterKey: true});
    console.log("Stuck on WaitingForDevice", usersEndedStudy2.length);
    for (const studyUser of usersEndedStudy2) {
        onWaitingForDevice.push(studyUser.get("insertTokenEmail"));
    }

    console.log(onWaitingForDevice);

    await delay(10000);

    let csv2Content = "Emails\n";
    for (const email of onWaitingForDevice) {
        csv2Content += email + "\n";
    }

    var a2 = document.createElement("a");
    var file2 = new Blob([csv2Content], {type: 'text/csv'});
    a2.href = URL.createObjectURL(file2);
    a2.download = "WaitingForDeviceEmails.csv";
    a2.click();

}


exports.SearchByEmailAddress = async(email) => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.contains("insertTokenEmail", email);
    queryStudyData.limit(1000);
    const resultStudyData = await queryStudyData.find({useMasterKey: true});
    console.log("resultStudyData", resultStudyData);

    const User = Parse.Object.extend("User");
    const queryUser = new Parse.Query(User);
    queryUser.contains("email", email);
    queryUser.limit(1000);
    const resultsUser = await queryUser.find();
    console.log("resultUser", resultsUser)

    const userIds = resultsUser.map((user) => user.id);

    const result = [];
    for (const studyData of resultStudyData) {
        if (!userIds.includes(studyData.get("user").id)) {
            result.push(studyData);
        }
    }

    for(const user of resultsUser) {
        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo("user", user);
        queryStudyData.limit(1000);
        const resultStudyData = await queryStudyData.find({useMasterKey: true});
        result.push(...resultStudyData);
    }

    console.log("result", result.length);
    return result;
}

exports.SearchByName = async(name) => {
    const Consent = Parse.Object.extend("Consent");
    const query = new Parse.Query(Consent);
    query.contains("name", name);
    query.limit(1000);
    const consentResults = await query.find({useMasterKey: true});

    const result = [];
    for(const consent of consentResults) {
        const StudyData = Parse.Object.extend("StudyData");
        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo("giveConsentKey", consent.get("token"));
        queryStudyData.limit(1000);
        const resultStudyData = await queryStudyData.find({useMasterKey: true});
        result.push(...resultStudyData);
    }

    const DeliveryAddress = Parse.Object.extend("DeliveryAddress");
    const addressQuery = new Parse.Query(DeliveryAddress);
    addressQuery.contains("name", name);
    const addressResults = await addressQuery.find({useMasterKey: true});

    const userIds = result.map((studyData) => studyData.get("user").id);

    let studyDatasToBeFetched = [];
    for(const address of addressResults) {
        if (!userIds.includes(address.get("user").id)) {
            studyDatasToBeFetched.push(address.get("user"));
        }
    }

    for(const user of studyDatasToBeFetched) {
        const StudyData = Parse.Object.extend("StudyData");
        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo("user", user);
        queryStudyData.limit(1000);
        const resultStudyData = await queryStudyData.find({useMasterKey: true});
        result.push(...resultStudyData);
    }

    console.log(result);
    return result;
}

exports.SearchByAddress = async(address) => {
    const DeliveryAddress = Parse.Object.extend("DeliveryAddress");

    const addressLine1Query = new Parse.Query(DeliveryAddress);
    addressLine1Query.contains("addressLine1", address);

    const addressLine2Query = new Parse.Query(DeliveryAddress);
    addressLine2Query.contains("addressLine2", address);

    const cityQuery = new Parse.Query(DeliveryAddress);
    cityQuery.contains("city", address);

    const postcodeQuery = new Parse.Query(DeliveryAddress);
    postcodeQuery.contains("postcode", address);

    const mainQuery = Parse.Query.or(addressLine1Query, addressLine2Query, cityQuery, postcodeQuery);
     
    const addressResults = await mainQuery.find({useMasterKey: true});

    const result = [];
    for(const address of addressResults) {
        const StudyData = Parse.Object.extend("StudyData");
        const queryStudyData = new Parse.Query(StudyData);
        queryStudyData.equalTo("user", address.get("user"));
        queryStudyData.limit(1000);
        const resultStudyData = await queryStudyData.find({useMasterKey: true});
        result.push(...resultStudyData);
    }

    console.log(result);
    return result;
}  

exports.GetUserThatNeedHelp = async() => {

    const bluetoothFailed = [];
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("currentState", "FailedBluetoothUpdateForStudyStage");
    const result = await queryStudyData.find({useMasterKey: true});
    for(const studyData of result) {
        bluetoothFailed.push(studyData.get("insertTokenEmail"));
    }

    const assessment1 = [];
    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("currentState", "Assessment1");
    const result2 = await queryStudyData2.find({useMasterKey: true});
    for(const studyData of result2) {
        assessment1.push(studyData.get("insertTokenEmail"));
    }

    const assessment2 = [];
    const queryStudyData3 = new Parse.Query(StudyData);
    queryStudyData3.equalTo("currentState", "Assessment2");
    const result3 = await queryStudyData3.find({useMasterKey: true});
    for(const studyData of result3) {
        assessment2.push(studyData.get("insertTokenEmail"));
    }

    const assessment3 = [];
    const queryStudyData4 = new Parse.Query(StudyData);
    queryStudyData4.equalTo("currentState", "Assessment3");
    const result4 = await queryStudyData4.find({useMasterKey: true});
    for(const studyData of result4) {
        assessment3.push(studyData.get("insertTokenEmail"));
    }

    const assessment4 = [];
    const queryStudyData5 = new Parse.Query(StudyData);
    queryStudyData5.equalTo("currentState", "Assessment4");
    const result5 = await queryStudyData5.find({useMasterKey: true});
    for(const studyData of result5) {
        assessment4.push(studyData.get("insertTokenEmail"));
    }


    console.log("Bluetooth",bluetoothFailed);
    console.log(assessment1);
    console.log(assessment2);
    console.log(assessment3);
    console.log(assessment4);



    /*
    let bluetoothFailedCsv = "Emails\n";
    for(let email of bluetoothFailed) {
        bluetoothFailedCsv += email + "\n";
    }

    var a = document.createElement("a");
    var file = new Blob([bluetoothFailedCsv], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "bluetoothFailed.csv";
    a.click();


    await delay(10000);*/

    let assessments = assessment1.concat(assessment2).concat(assessment3).concat(assessment4);
    let assessmentCsv = "Emails\n";
    for(let email of assessments) {
        assessmentCsv += email + "\n";
    }

    let a = document.createElement("a");
    let file = new Blob([assessmentCsv], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "assessmentsWaiting.csv";
    a.click();

}

exports.GetMissingDataToMaster = async() => {
    const MissingHeaderBlocksCounterQuery = new Parse.Query("MissingHeaderBlocksCounter");
    let missingHeaderBlocksCounters = await MissingHeaderBlocksCounterQuery.findAll({useMasterKey:true});
    console.log(missingHeaderBlocksCounters);
    for(let missingHeaderBlocksCounter of missingHeaderBlocksCounters) {
        const missingHeaderBlocksCounterACL = new Parse.ACL();
        missingHeaderBlocksCounterACL.setPublicReadAccess(false);
        missingHeaderBlocksCounter.setACL(missingHeaderBlocksCounterACL);
        await missingHeaderBlocksCounter.save(null, {useMasterKey:true});
    }

    console.log("Done");
}


exports.CheckUserSwitchBranchBeforeWhileWaiting = async() => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("previousState", "WaitingForDevice");
    queryStudyData.equalTo("currentState", "FreeLiving");
    queryStudyData.equalTo("studyBranch", "FreeLivingFromTrial");
    queryStudyData.equalTo("deliveryProgress", "Awaiting processing");
    const result = await queryStudyData.find({useMasterKey: true});

    for(const studyData of result) {
        console.log(studyData.id, studyData.createdAt, studyData.get("user").id, studyData.get("insertTokenEmail"));
    }

    return result;
}

exports.SearchForStudyProgress = async(email) => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("studyBranch", "Trial");
    queryStudyData.notEqualTo("currentState", "WaitingForDevice");
    queryStudyData.notEqualTo("currentState", "PostStudy");
    queryStudyData.notEqualTo("currentState", "AskDeliveryInfo");
    queryStudyData.limit(1000);
    let resultStudyData = await queryStudyData.find({useMasterKey: true});
    console.log("resultStudyData", resultStudyData);

    let data = []

    resultStudyData = resultStudyData.filter(studyData => studyData.get("currentState") != 'WaitingForDevice' && 
        studyData.get("currentState") != 'PostStudy' && studyData.get("currentState") != 'AskDeliveryInfo');

    for(const studyData of resultStudyData) {

        let currentState = studyData.get("currentState");
        currentState = currentState[0].toLowerCase() + currentState.slice(1);

        let tempData = {
            studyDataId: studyData.id,
            user: studyData.get("user").id,
            currentState,
            start: currentState != "failedBluetoothUpdateForStudyStage" ? new Date(studyData.get(`${currentState}DateStarted`)) : new Date(),
            previousState: studyData.get("previousState"),
            cueingMethod1FinishingDate: studyData.get("cueingMethod1FinishingDate"),
            cueingMethod2FinishingDate: studyData.get("cueingMethod2FinishingDate"),
            washoutFinishingDate: studyData.get("washoutPeriodFinishingDate"),
        }
        data.push(tempData);
    }

    data = data.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    console.log(data);

    let csvContent = "studyDataId,user,currentState,start,previousState,cueingMethod1FinishingDate,cueingMethod2FinishingDate,washoutFinishingDate\n"
    data.forEach(data => {
      csvContent += `${data.studyDataId},${data.user},${data.currentState},${data.start},${data.previousState},${data.cueingMethod1FinishingDate},${data.cueingMethod2FinishingDate},${data.washoutFinishingDate}\n`
    });

    let a = document.createElement("a");
    let file = new Blob([csvContent], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "trialReport.csv";
    a.click();
}


exports.SetUserToLeaveStudy = async(studyData) => {
    const LeftStudy = Parse.Object.extend("LeftStudy");
    const leftStudyObject = new LeftStudy();
    const leftStudyACL = new Parse.ACL();
    leftStudyACL.setPublicReadAccess(false);
    leftStudyObject.setACL(leftStudyACL);
    leftStudyObject.set("user", studyData.get("user"));
    leftStudyObject.set("studyState", studyData.get("currentState"));
    leftStudyObject.set("studyBranch", studyData.get("studyBranch"));
    await leftStudyObject.save(null, {useMasterKey: true});

    studyData.set("previousState", studyData.get("currentState"));
    studyData.set("currentState", "NoStudy");
    studyData.set("studyBranch", "NoStudy");
    studyData.set("serverLastUpdate", new Date());
    await studyData.save({}, {useMasterKey: true});
}


exports.SearchByStudyDataId = async(studyDataId) => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.contains("objectId", studyDataId);
    queryStudyData.limit(1000);
    const resultStudyData = await queryStudyData.find({useMasterKey: true});
   
    return resultStudyData;
}

exports.SearchByUserId = async(userId) => {
    const User = Parse.Object.extend("User");
    const query = new Parse.Query(User);
    query.contains("objectId", userId);
    query.limit(5000);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.SearchForStudyWaitingDevice = async(email) => {
    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("currentState", "WaitingForDevice");
    queryStudyData.limit(1000);
    let resultStudyData = await queryStudyData.find({useMasterKey: true});
    console.log("resultStudyData", resultStudyData);

    let data = []

    resultStudyData = resultStudyData.filter(studyData => studyData.get("currentState") != 'WaitingForDevice' && 
        studyData.get("currentState") != 'PostStudy' && studyData.get("currentState") != 'AskDeliveryInfo');

    for(const studyData of resultStudyData) {

        let currentState = studyData.get("currentState");
        currentState = currentState[0].toLowerCase() + currentState.slice(1);

        let tempData = {
            studyDataId: studyData.id,
            user: studyData.get("user").id,
            currentState,
            start: currentState != "failedBluetoothUpdateForStudyStage" ? new Date(studyData.get(`${currentState}DateStarted`)) : new Date(),
            previousState: studyData.get("previousState"),
            cueingMethod1FinishingDate: studyData.get("cueingMethod1FinishingDate"),
            cueingMethod2FinishingDate: studyData.get("cueingMethod2FinishingDate"),
            washoutFinishingDate: studyData.get("washoutPeriodFinishingDate"),
        }
        data.push(tempData);
    }

    data = data.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    console.log(data);

    let csvContent = "studyDataId,user,currentState,start,previousState,cueingMethod1FinishingDate,cueingMethod2FinishingDate,washoutFinishingDate\n"
    data.forEach(data => {
      csvContent += `${data.studyDataId},${data.user},${data.currentState},${data.start},${data.previousState},${data.cueingMethod1FinishingDate},${data.cueingMethod2FinishingDate},${data.washoutFinishingDate}\n`
    });

    let a = document.createElement("a");
    let file = new Blob([csvContent], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "trialReport.csv";
    a.click();
}

exports.getParticipantsFromArea = async() => {

    console.log("start")

    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.limit(1000);
    const studyDatas = await queryStudyData.find({useMasterKey: true});

    console.log(studyDatas.length);

    let userInfo = [];

    for(let studyData of studyDatas) {
        var userId = studyData.get("user").id;
        const DeliveryAddress = Parse.Object.extend("DeliveryAddress");
        const addressQuery = new Parse.Query(DeliveryAddress);
        addressQuery.equalTo("user", userId);
        const results = await addressQuery.find({useMasterKey: true});
        if(results.length > 0) {
            userInfo.push({studyData, postcode: results[0].get("postcode")});
        }
    }

    console.log(userInfo.length);

    for(let info of userInfo) {
        var postcodeInfo = await this.GetPostCodeInfo(info.postcode);
        info.postcodeInfo =  {
            county: postcodeInfo.result["admin_county"],
            region: postcodeInfo.result["region"],
            district: postcodeInfo.result["admin_district"],
            country: postcodeInfo.result["country"],
        };
        await delay(500);
    }

    let result = []

    for(let info of userInfo) {
        if(/*info.postcodeInfo.region == "North West" /*||*/
            info.postcodeInfo.district == "Cumberland") {
            result.push(info);
        }
    }

    console.log(result)

    for(let info of result) {
        const Consent = Parse.Object.extend("Consent");
        const query = new Parse.Query(Consent);
        query.equalTo("token", info.studyData.get("giveConsentKey"));
        query.limit(1000);
        const consentResults = await query.find({useMasterKey: true});
        info.consentData = consentResults[0];
    }

    console.log(result)

    await createCSVWithConsentPlusAddress(result);
}

async function createCSVWithConsentPlusAddress(datas) {
    var dataForCSV = [];

    let ealiestDate = new Date(9999,1,1);

    for (const data of datas) {
    
        let studyBranch = data.studyData.get("studyBranch");

        if(data.consentData.get("createdAt") < ealiestDate) {
            ealiestDate = data.consentData.get("createdAt");
        }


        if(studyBranch == "NoStudy") {
            const LeftStudyQuery = new Parse.Query("LeftStudy")
            LeftStudyQuery.equalTo("user", data.studyData.get("user"));
            const leftStudyResult = await LeftStudyQuery.find({useMasterKey:true});
        
            if(leftStudyResult.length > 0) {
                studyBranch = leftStudyResult[0].get("studyBranch");
            } else {
                continue;
            }
            
        } else if(studyBranch == "FreeLivingFromTrial") {
            studyBranch = "FreeLiving";
        }


        var consentId = data.consentData.get("participantReference");
        consentId = consentId.replaceAll("undefined", "");

        const userData = {
            name: data.consentData.get("name"),
            id: consentId,
            consentFormFilledDate: data.consentData.get("createdAt"),
            studyBranch
        };
      
        const token = data.consentData.get("token");
        const demographicsDataQuery = new Parse.Query("DemographicsData")
        demographicsDataQuery.equalTo("token", token);
        const demographicsDataQueryResult = await demographicsDataQuery.find({useMasterKey:true});
        if(demographicsDataQueryResult.length == 0) {
            userData['YearOfBirth'] = "Demographics data not found";
        } else {
        const ageRange = demographicsDataQueryResult[0].get("ageRange");
        if(ageRange == null) {
            userData['YearOfBirth'] = "Not disclosed by participant";
        }
        const ageRangeString = ageRange.substring(0,2);
            userData['YearOfBirth'] = isNaN(ageRangeString) ? "Not disclosed by participant" : new Date().getFullYear() - Number(ageRangeString);
        }

        userData['District'] = data.postcodeInfo.district;
        dataForCSV.push(userData);
    }

    let csvContent = "Id,Name,YearOfBirth,ConsentFormFilledDate,StudyBranch,District\n"
    dataForCSV.forEach(data => {
      csvContent += `${data.id},${data.name},${data.YearOfBirth},${data.consentFormFilledDate},${data.studyBranch},${data.District}\n`
    });

    const currentDate = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(currentDate);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
  
    
    var a = document.createElement("a");
    var file = new Blob([csvContent], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "participantsInCumbria.csv";
    a.click();
}


exports.GetPeopleWhoAreStuckData = async() => {
    console.log('started')

    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.limit(1000);
    queryStudyData.equalTo("currentState", "WaitingForDevice");
    const usersEndedStudy = await queryStudyData.find({useMasterKey: true});
    let datas = []
    
    for (const studyUser of usersEndedStudy) {
        const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
        const queryDeviceOrderSchema = new Parse.Query(DeviceOrderSchema);
        queryDeviceOrderSchema.equalTo("user", studyUser.get("user"));
        queryDeviceOrderSchema.limit(1000);
        const deviceOrderSchemaResult = await queryDeviceOrderSchema.find({useMasterKey: true});
        console.log(deviceOrderSchemaResult.length)
        let data = {
            objectId: studyUser.id,
            start: studyUser.get("waitingForDeviceDateStarted"),
            branch: studyUser.get("studyBranch"),
            device: studyUser.get("selectBranchesDevice").replaceAll(",", "."),
            version: studyUser.get("selectBranchesVersion"),
            platform: studyUser.get("selectBranchesPlatform"),
            idiom: studyUser.get("selectBranchesIdiom"),
            deviceType: studyUser.get("selectBranchesDeviceType"),
            address1: "Not found",
            deviceBox1: "Not found",
            name1: 'Not found',
            address2: "Not found",
            deviceBox2: "Not found",
            name2: "Not found"
        }

        if(deviceOrderSchemaResult.length > 0) {
            for(let i = 0; i < deviceOrderSchemaResult.length; i++) {
                data[`address${i + 1}`] = deviceOrderSchemaResult[i].get('address').replaceAll(',', ' ').replaceAll('\n', ' ').replaceAll('  ', ' ').toLowerCase();
                data[`name${i + 1}`] = deviceOrderSchemaResult[i].get('name').replaceAll(',', ' ').replaceAll('\n', ' ').replaceAll('  ', ' ').toLowerCase();
                const DeviceBoxSchema = Parse.Object.extend("DeviceBoxSchema");
                const queryDeviceBoxSchema = new Parse.Query(DeviceBoxSchema);
                try {
                    const deviceBoxResult = await queryDeviceBoxSchema.get(deviceOrderSchemaResult[i].get('deviceBox'), {useMasterKey: true});
                    if(deviceBoxResult != null) {
                        console.log(deviceBoxResult)
                        console.log(deviceBoxResult.get('boxNumber'))
                        data[`deviceBox${i+1}`] = deviceBoxResult.get('boxNumber')
                    }
                } catch(e) {
                    console.log(e)
                }
                
            }
        }

        datas.push(data);
    }

    datas = datas.sort((a, b) => new Date(a.start) - new Date(b.start));

    let csvContent = "objectId,start,branch,device,version,platform,idiom,deviceType,address1,deviceBox1,name1,address2,deviceBox2,name2\n";
    datas.forEach(data => {
      csvContent += `${data.objectId},${data.start},${data.branch},${data.device},${data.version},${data.platform},${data.idiom},${data.deviceType},${data.address1},${data.deviceBox1},${data.name1},${data.address2},${data.deviceBox2},${data.name2}\n`
    });

    var a = document.createElement("a");
    var file = new Blob([csvContent], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "WaitingForDeviceData.csv";
    a.click();

    console.log('end')
}

exports.EraseAddress = async() => {

    console.log("Easing address");

    const DeliveryAddress = Parse.Object.extend("DeliveryAddress");
    const addressQuery = new Parse.Query(DeliveryAddress);
    addressQuery.limit(1000);
    const results = await addressQuery.find({useMasterKey: true});

    for(const address of results) {
        console.log(address.id);
        address.set("name", null);
        address.set("addressLine1", null);
        address.set("addressLine2", null);
        address.set("city", null);

        await address.save(null, {useMasterKey: true});
    }

    console.log(results.length);

    console.log("Easing address done");
};

exports.EraseDeviceOrder = async() => {

    console.log("Device Order Schema");

    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const deviceOrderSchemaQuery = new Parse.Query(DeviceOrderSchema);
    deviceOrderSchemaQuery.limit(1000);
    const results = await deviceOrderSchemaQuery.find({useMasterKey: true});

    for(const deviceOrderSchema of results) {
        console.log(deviceOrderSchema.get("address"));
        deviceOrderSchema.set("address", null);
        deviceOrderSchema.set("name", null);
        await deviceOrderSchema.save(null, {useMasterKey: true});
    }

    console.log("Easing address done");

};

exports.EraseAppFeedback = async() => {
    
        console.log("App Feedback");
    
        const AppFeedback = Parse.Object.extend("AppFeedback");
        const appFeedbackQuery = new Parse.Query(AppFeedback);
        appFeedbackQuery.limit(1000);
        const results = await appFeedbackQuery.find({useMasterKey: true});
    
        for(const appFeedback of results) {
            appFeedback.set("username", null);
            await appFeedback.save(null, {useMasterKey: true});
        }
    
        console.log("App Feedback done");
}

exports.GetParticipantDistribution = async() => {

    const StudyData = Parse.Object.extend("StudyData");
    const queryStudyData = new Parse.Query(StudyData);
    queryStudyData.equalTo("currentState", "PostStudy");
    queryStudyData.limit(1000);
    let resultStudyData = await queryStudyData.find({useMasterKey: true});

    const queryStudyData2 = new Parse.Query(StudyData);
    queryStudyData2.equalTo("previousState", "PostStudy");
    const usersEndedStudy2 = await queryStudyData2.find({useMasterKey: true});
    resultStudyData = resultStudyData.concat(usersEndedStudy2);
    
    let data = []
    for(const studyData of resultStudyData) {
        data.push({
            studyDataId: studyData.id,
            user: studyData.get("user").id,
            cueingMethod1: studyData.get("cueingMethod1"),
            cueingMethod2: studyData.get("cueingMethod2"),
        });
    }

    let csvContent = "studyDataId,user,intervention-order\n"
    data.forEach(data => {
      csvContent += `${data.studyDataId},${data.user},${data.cueingMethod1}-${data.cueingMethod2}\n`
    });

    var a = document.createElement("a");
    var file = new Blob([csvContent], {type: 'text/csv'});
    a.href = URL.createObjectURL(file);
    a.download = "participant_distribution.csv";
    a.click();

}