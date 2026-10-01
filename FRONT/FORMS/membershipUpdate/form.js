/* SCSLAI — Membership Update Form Config */
(function(){
"use strict";

SCSLAI.register({
key:"membershipUpdate",
title:"Membership Update Form",
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
ben3Name:"Beneficiary #3 Name",ben3Dob:"Beneficiary #3 DOB",ben3Rel:"Relationship",ben3Contact:"Contact No."
},
width:2550, height:4200,
hasPage2:false, hasCheckboxes:false, useUppercase:true,
mobileField:"mobileNumber",
pdfPrefix:"Membership-Update-",
pdfSuffix:"Form",
/* 2x2 photo box (top-right "Attach Recent Photo"). Adjust x/y/w/h to match scan. */
photo:{x:1800,y:95,w:598,h:600},
images:["FORMS/MEMBERSHIP FORM UPDATE 2025 V2.png"],

fields:{
/* PERSONAL INFORMATION */
lastName:{x:303,y:995,w:539,h:52,fs:24},
firstName:{x:932,y:995,w:664,h:52,fs:24},
middleName:{x:1691,y:995,w:581,h:52,fs:24},
birthdate:{x:409,y:1112,w:415,h:52,fs:24},
placeOfBirth:{x:1168,y:1112,w:436,h:52,fs:24},
nationality:{x:1879,y:1112,w:415,h:52,fs:24},
gender:{x:319,y:1171,w:477,h:52,fs:24},
civilStatus:{x:1127,y:1171,w:498,h:52,fs:24},
spouseName:{x:469,y:1229,w:623,h:52,fs:24},
spouseBirth:{x:1617,y:1229,w:373,h:52,fs:24},
motherMaiden:{x:597,y:1288,w:871,h:52,fs:24},
homeAddress:{x:579,y:1346,w:1577,h:52,fs:24},
telephone:{x:431,y:1405,w:664,h:52,fs:24},
mobileNumber:{x:1430,y:1405,w:726,h:52,fs:24},
emailAddress:{x:443,y:1459,w:1079,h:52,fs:24},
permanentAddr:{x:638,y:1522,w:1515,h:52,fs:24},

/* OFFICE / EMPLOYMENT INFORMATION */
officeDivision:{x:468,y:1732,w:594,h:52,fs:24},
rankPosition:{x:1503,y:1732,w:411,h:52,fs:24},
gsisId:{x:390,y:1796,w:411,h:52,fs:24},
tin:{x:1007,y:1796,w:616,h:52,fs:24},
edpNumber:{x:1832,y:1796,w:457,h:52,fs:24},
officeAddress:{x:880,y:1861,w:1483,h:52,fs:24},
monthlySalary:{x:474,y:1925,w:571,h:52,fs:24},
lengthService:{x:1413,y:1925,w:571,h:52,fs:24},
appointment:{x:616,y:1989,w:434,h:52,fs:24},
dateAppoint:{x:1467,y:1989,w:365,h:52,fs:24},
officeTel:{x:2107,y:1989,w:251,h:52,fs:22},
incomeSource:{x:1493,y:2054,w:868,h:52,fs:24},

/* LEGAL HEIRS / BENEFICIARY (3 rows) */
ben1Name:{x:162,y:2451,w:528,h:46,fs:20},
ben1Dob:{x:706,y:2451,w:572,h:46,fs:20},
ben1Rel:{x:1295,y:2451,w:572,h:46,fs:20},
ben1Contact:{x:1885,y:2451,w:510,h:46,fs:18},
ben2Name:{x:162,y:2517,w:528,h:46,fs:20},
ben2Dob:{x:706,y:2517,w:572,h:46,fs:20},
ben2Rel:{x:1295,y:2517,w:572,h:46,fs:20},
ben2Contact:{x:1885,y:2517,w:510,h:46,fs:18},
ben3Name:{x:162,y:2584,w:528,h:46,fs:20},
ben3Dob:{x:706,y:2584,w:572,h:46,fs:20},
ben3Rel:{x:1295,y:2584,w:572,h:46,fs:20},
ben3Contact:{x:1885,y:2584,w:510,h:46,fs:18},

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
if(!vals.appointment)miss.push("Status of Appointment");
if(!vals.dateAppoint)miss.push("Date of Appointment");
if(!vals.officeTel)miss.push("Office Tel. No.");
if(!vals.incomeSource)miss.push("Source of Income");
},

getResult:function(vals){
return{form:"membershipUpdate",fields:vals};
}

});

})();