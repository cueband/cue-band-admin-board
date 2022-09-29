const Parse = require('parse');

Parse.initialize(process.env.VUE_APP_APP_ID, process.env.VUE_APP_JAVASCRIPT_KEY, process.env.VUE_APP_MASTER_KEY);
Parse.masterKey = process.env.VUE_APP_MASTER_KEY;

Parse.serverURL = process.env.VUE_APP_SERVER_URL

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.VUE_APP_SENDGRID_API_KEY);

// const DELIVERY_PROGRESS_AWAITING_PROCESSING = "Awaiting processing";
const DELIVERY_PROGRESS_DEVICE_SENT = "Device Sent";

const isDeviceSent = (label) => {
    return label.get("trackingCode") && label.get("deviceBox");
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
    const results = await query.find();
    return results;
}

exports.GetStudyData = async () => {
    const StudyData = Parse.Object.extend("StudyData");
    const query = new Parse.Query(StudyData);
    const results = await query.find({useMasterKey: true});
    return results;
}

exports.getConsentReports = async () => {
    const ConsentReports = Parse.Object.extend("ConsentReport");
    const query = new Parse.Query(ConsentReports);
    const results = await query.find();
    return results;
}

exports.getDeviceOrderReports = async () => {
    const DeviceOrderReport = Parse.Object.extend("DeviceOrderReport");
    const query = new Parse.Query(DeviceOrderReport);
    const results = await query.find();
    return results;
}

exports.GetUnexportedDeviceOrderCounts = async () => {
    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.containedIn("isReportExported", [false, null]);
    query.notEqualTo("trackingCode", null);
    query.notEqualTo("deviceBox", null);
    const count = await query.count({useMasterKey: true});
    return count;
}

exports.GetUnexportedDeviceOrders = async () => {
    const DeviceOrderSchema = Parse.Object.extend("DeviceOrderSchema");
    const query = new Parse.Query(DeviceOrderSchema);
    query.containedIn("isReportExported", [false, null]);
    query.notEqualTo("trackingCode", null);
    query.notEqualTo("deviceBox", null);
    query.ascending("updatedAt");
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

exports.GetConsent = async (token) => {
    const Consent = Parse.Object.extend("Consent");
    const query = new Parse.Query(Consent);
    query.equalTo("token", token);
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

    const deviceOrderACL = new Parse.ACL(user);
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