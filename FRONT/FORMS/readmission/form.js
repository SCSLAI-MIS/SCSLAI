/* SCSLAI — Readmission Form Config */
(function(){
"use strict";

SCSLAI.register({
key:"readmission",
title:"Readmission Form",
fieldLabels:{
lastName:"Last Name",firstName:"First Name",middleName:"Middle Name",
birthdate:"Date of Birth",placeOfBirth:"Place of Birth",nationality:"Nationality",
gender:"Gender",civilStatus:"Civil Status",spouseName:"Spouse Name",spouseBirth:"Spouse Birthdate",
motherMaiden:"Mother's Maiden Name",homeAddress:"Home Address",telephone:"Telephone Number",
mobile:"Mobile Number",emailAddress:"Email Address",permanentAddr:"Permanent Address",
officeStation:"Office / Station",position:"Position",gsisId:"GSIS ID No.",tin:"TIN",
edpNumber:"EDP Number",officeAddress:"Office Address",monthlySalary:"Monthly Salary",
lengthService:"Length of Service",appointment:"Status of Appointment",dateAppoint:"Date of Appointment",
officeTel:"Office Tel. No.",incomeSource:"Source of Income"
},
width:2550, height:4200,
hasPage2:false, hasCheckboxes:false, useUppercase:false,
mobileField:"mobile",
pdfPrefix:"Readmission-",
pdfSuffix:"Membership-Readmission",
/* 2x2 photo box (top-right "Attach Recent Photo (2x2)"). Adjust x/y/w/h to match scan. */
photo:{x:1800,y:95,w:598,h:600},
images:["FORMS/MEMBERSHIP RE-ADMISSION 2025 Edition.png"],

fields:{
lastName:{x:300,y:1300,w:550,h:55,fs:28},
firstName:{x:920,y:1300,w:700,h:55,fs:28},
middleName:{x:1650,y:1300,w:650,h:55,fs:28},
birthdate:{x:420,y:1424,w:450,h:48,fs:26},
placeOfBirth:{x:1180,y:1424,w:490,h:48,fs:26},
nationality:{x:1890,y:1424,w:450,h:48,fs:26},
gender:{x:335,y:1484,w:580,h:48,fs:26},
civilStatus:{x:1140,y:1484,w:560,h:48,fs:26},
spouseName:{x:480,y:1540,w:740,h:48,fs:26},
spouseBirth:{x:1625,y:1540,w:500,h:48,fs:26},
motherMaiden:{x:610,y:1596,w:850,h:48,fs:26},
homeAddress:{x:590,y:1659,w:1700,h:48,fs:25},
telephone:{x:440,y:1716,w:780,h:48,fs:26},
mobile:{x:1440,y:1716,w:750,h:48,fs:26},
emailAddress:{x:460,y:1773,w:1200,h:48,fs:26},
permanentAddr:{x:650,y:1834,w:1500,h:48,fs:25},
officeStation:{x:480,y:2011,w:740,h:52,fs:26},
position:{x:1515,y:2011,w:700,h:52,fs:26},
gsisId:{x:400,y:2089,w:510,h:48,fs:25},
tin:{x:1025,y:2089,w:640,h:48,fs:25},
edpNumber:{x:1845,y:2089,w:550,h:48,fs:25},
officeAddress:{x:895,y:2151,w:1500,h:48,fs:25},
monthlySalary:{x:495,y:2211,w:560,h:48,fs:25},
lengthService:{x:1430,y:2211,w:600,h:48,fs:25},
appointment:{x:630,y:2276,w:420,h:48,fs:25},
dateAppoint:{x:1475,y:2276,w:370,h:48,fs:25},
officeTel:{x:2100,y:2276,w:300,h:48,fs:25},
incomeSource:{x:1505,y:2340,w:900,h:44,fs:24},

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
if(!vals.edpNumber)miss.push("EDP Number");
if(!vals.lastName)miss.push("Last Name");
if(!vals.firstName)miss.push("First Name");
if(!vals.birthdate)miss.push("Birthdate");
if(!vals.placeOfBirth)miss.push("Place of Birth");
if(!vals.nationality)miss.push("Nationality");
if(!vals.gender)miss.push("Gender");
if(!vals.civilStatus)miss.push("Civil Status");
if(!vals.homeAddress)miss.push("Home Address");
if(!vals.telephone)miss.push("Telephone Number");
if(!vals.mobile)miss.push("Mobile Number");
if(!vals.emailAddress)miss.push("Email Address");
if(!vals.permanentAddr)miss.push("Permanent Address");
if(!vals.officeStation)miss.push("Office / Station");
if(!vals.position)miss.push("Position");
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
return{form:"readmission",fields:vals};
}

});

})();
