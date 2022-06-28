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