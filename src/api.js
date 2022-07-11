const Parse = require('parse');

Parse.initialize(process.env.VUE_APP_APP_ID, process.env.VUE_APP_JAVASCRIPT_KEY, process.env.VUE_APP_MASTER_KEY);
Parse.masterKey = process.env.VUE_APP_MASTER_KEY;

Parse.serverURL = process.env.VUE_APP_SERVER_URL

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.VUE_APP_SENDGRID_API_KEY);

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
        const deviceBoxSave = await deviceBox.save();
        deviceBoxId = deviceBoxSave.id;
    } else {
        deviceBoxId = boxResults[0].id;
    }

    if (trackingCode) labelObject.set("trackingCode", trackingCode);
    labelObject.set("deviceBox", deviceBoxId);
    let result = await labelObject.save({}, { useMasterKey: true });
    return result;
}

exports.saveAddressLabel = async ({trackingCode, user, labelId, address, boxNumber}) => {
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
    if (address) deviceOrder.set('address', address);
    if (trackingCode) deviceOrder.set('trackingCode', trackingCode);
    if (deviceBoxId) deviceOrder.set('deviceBox', deviceBoxId);
    if (labelId) deviceOrder.set('labelId', labelId);

    const deviceOrderACL = new Parse.ACL();
    deviceOrderACL.setPublicReadAccess(false);
    deviceOrder.setACL(deviceOrderACL);
    let deviceOrderSave = await deviceOrder.save();
    console.log(deviceOrder);
    console.log(deviceOrderSave);
    return deviceOrderSave;
}

exports.SendConfirmationEmail = async(email) => {
   
    const emailBody = {
        to: email,
        from: process.env.VUE_APP_EMAIL_SENDER,
        templateId: process.env.VUE_APP_TEMPLATE_ID,
        dynamicTemplateData: {
            email,
        },
    }

    try {
        console.log(emailBody);
        // TODO: uncomment the following line and fix email sending
        // const result = await sgMail.send(emailBody);
        // console.log(result);
        return true;
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
        return false;
    }

}