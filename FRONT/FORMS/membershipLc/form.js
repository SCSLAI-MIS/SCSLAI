/* SCSLAI — LC Membership Application Form Config (FORM 21)
   Single page image: 2550x4200. */
(function(){
"use strict";

SCSLAI.register({
key:"membershipLc",
title:"LC Membership Application Form",
fieldLabels:{
lastName:"Last Name",firstName:"First Name",middleName:"Middle Name",
birthdate:"Date of Birth",placeOfBirth:"Place of Birth",nationality:"Nationality",
gender:"Gender",civilStatus:"Civil Status",spouseName:"Spouse Name",spouseBirth:"Spouse Birthdate",
motherMaiden:"Mother's Maiden Name",homeAddress:"Present Home Address",telephone:"Telephone No.",
mobileNumber:"Mobile No.",emailAddress:"Email Address",permanentAddr:"Permanent Address",
officeDivision:"Office / Division",rankPosition:"Rank / Position",gsisId:"GSIS ID No.",tin:"TIN",
edpNumber:"EDP No.",officeAddress:"Office Address",monthlySalary:"Monthly Salary",
lengthService:"Length of Service",appointment:"Status of Appointment",dateAppoint:"Date of Appointment",
officeTel:"Office Tel. No.",incomeSource:"Source of Income",
ben1Name:"Beneficiary #1 Name",ben1Dob:"Beneficiary #1 DOB",ben1Rel:"Relationship",ben1Contact:"Contact No.",
ben2Name:"Beneficiary #2 Name",ben2Dob:"Beneficiary #2 DOB",ben2Rel:"Relationship",ben2Contact:"Contact No.",
ben3Name:"Beneficiary #3 Name",ben3Dob:"Beneficiary #3 DOB",ben3Rel:"Relationship",ben3Contact:"Contact No.",
ben4Name:"Beneficiary #4 Name",ben4Dob:"Beneficiary #4 DOB",ben4Rel:"Relationship",ben4Contact:"Contact No.",
sig1:"Specimen Signature 1",sig2:"Specimen Signature 2",sig3:"Specimen Signature 3"
},
width:2550, height:4200,
hasPage2:false, hasCheckboxes:false, useUppercase:true,
mobileField:"mobileNumber",
pdfPrefix:"LC-Membership-Application-",
pdfSuffix:"Form",
/* 2x2 photo box (top-right "Attach Recent Photo"). Adjust x/y/w/h to match scan. */
photo:{x:1800,y:95,w:598,h:600},
images:[
"FORMS/LOWER COURT MEMBERSHIP APPLICATION FORM 01.png"
],

fields:{
/* PERSONAL INFORMATION */
lastName:{x:308,y:1300,w:536,h:50,fs:24},
firstName:{x:936,y:1300,w:660,h:50,fs:24},
middleName:{x:1696,y:1300,w:578,h:50,fs:24},
birthdate:{x:414,y:1417,w:412,h:50,fs:24},
placeOfBirth:{x:1174,y:1417,w:432,h:50,fs:24},
nationality:{x:1884,y:1417,w:410,h:50,fs:24},
gender:{x:324,y:1477,w:474,h:50,fs:24},
civilStatus:{x:1132,y:1477,w:494,h:50,fs:24},
spouseName:{x:474,y:1535,w:618,h:50,fs:24},
spouseBirth:{x:1622,y:1535,w:370,h:50,fs:24},
motherMaiden:{x:602,y:1594,w:868,h:50,fs:24},
homeAddress:{x:584,y:1652,w:1572,h:50,fs:24},
telephone:{x:436,y:1711,w:660,h:50,fs:24},
mobileNumber:{x:1434,y:1711,w:724,h:50,fs:24},
emailAddress:{x:448,y:1754,w:1076,h:50,fs:24},
permanentAddr:{x:642,y:1828,w:1512,h:50,fs:24},

/* SERVICE / EMPLOYMENT INFORMATION */
officeDivision:{x:474,y:2017,w:590,h:50,fs:24},
rankPosition:{x:1510,y:2017,w:406,h:50,fs:24},
gsisId:{x:396,y:2081,w:408,h:50,fs:24},
tin:{x:1014,y:2081,w:612,h:50,fs:24},
edpNumber:{x:1838,y:2081,w:452,h:50,fs:24},
officeAddress:{x:886,y:2146,w:1480,h:50,fs:24},
monthlySalary:{x:480,y:2211,w:568,h:50,fs:24},
lengthService:{x:1418,y:2211,w:568,h:50,fs:24},
appointment:{x:622,y:2275,w:430,h:50,fs:24},
dateAppoint:{x:1472,y:2275,w:362,h:50,fs:24},
officeTel:{x:2114,y:2275,w:246,h:50,fs:20},
incomeSource:{x:1500,y:2339,w:864,h:50,fs:24},

/* LEGAL HEIRS / BENEFICIARY (4 table rows) */
ben1Name:{x:154,y:2645,w:572,h:64,fs:20},
ben1Dob:{x:734,y:2645,w:592,h:64,fs:20},
ben1Rel:{x:1334,y:2645,w:594,h:64,fs:20},
ben1Contact:{x:1936,y:2645,w:510,h:64,fs:18},
ben2Name:{x:154,y:2719,w:572,h:64,fs:20},
ben2Dob:{x:734,y:2719,w:592,h:64,fs:20},
ben2Rel:{x:1334,y:2719,w:594,h:64,fs:20},
ben2Contact:{x:1936,y:2719,w:510,h:64,fs:18},
ben3Name:{x:154,y:2795,w:572,h:64,fs:20},
ben3Dob:{x:734,y:2795,w:592,h:64,fs:20},
ben3Rel:{x:1334,y:2795,w:594,h:64,fs:20},
ben3Contact:{x:1936,y:2795,w:510,h:64,fs:18},
ben4Name:{x:154,y:2867,w:572,h:68,fs:20},
ben4Dob:{x:734,y:2867,w:592,h:68,fs:20},
ben4Rel:{x:1334,y:2867,w:594,h:68,fs:20},
ben4Contact:{x:1936,y:2867,w:510,h:68,fs:18},

},

validate:function(vals,miss){
if(!vals.lastName)miss.push("Last Name");
if(!vals.firstName)miss.push("First Name");
if(!vals.birthdate)miss.push("Date of Birth");
if(!vals.homeAddress)miss.push("Present Home Address");
if(!vals.mobileNumber)miss.push("Mobile No.");
if(!vals.edpNumber)miss.push("EDP No.");
if(!vals.officeDivision)miss.push("Office / Division");
if(!vals.rankPosition)miss.push("Rank / Position");
if(!vals.gsisId)miss.push("GSIS ID No.");
if(!vals.tin)miss.push("TIN");
if(!vals.officeAddress)miss.push("Office Address");
if(!vals.monthlySalary)miss.push("Monthly Salary");
if(!vals.lengthService)miss.push("Length of Service");
if(!vals.appointment)miss.push("Status of Appointment");
if(!vals.dateAppoint)miss.push("Date of Appointment");
if(!vals.officeTel)miss.push("Office Tel. No.");
if(!vals.incomeSource)miss.push("Source of Income");

},

getResult:function(vals){
return{form:"membershipLc",fields:vals};
}

});

})();