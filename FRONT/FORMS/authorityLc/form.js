/* SCSLAI — LC Authority to Deduct Form (FORM NO. 0427)
   Single page 2550x4200. Image identical to SC copy; same coordinates.
   Includes civil-status checkboxes (Single/Married/Widow). */
(function(){
"use strict";

SCSLAI.register({
key:"authorityLc",
title:"LC Authority to Deduct Form",
fieldLabels:{
fullName:"Full Name",employedAs:"Presently employed as",
officeOf:"Office",signDay:"Date today",signMonth:"Month today",
signYear:"Year today",signTime:"Time",
email:"Email",mobileNumber:"Mobile Number",permanentAddr:"Permanent Address"
},
width:2550, height:4200,
hasPage2:false, hasCheckboxes:true, useUppercase:true,
mobileField:"mobileNumber",
pdfPrefix:"LC-Authority-To-Deduct-",
pdfSuffix:"Form",
images:["FORMS/AUTHORITY TO DEDUCT - form - LC.png"],

labels:{
cbSingle:"Single",
cbMarried:"Married",
cbWidow:"Widow"
},

checkboxes:{
cbSingle:{cx:1606,cy:1295,w:38,h:38,category:"civilStatus"},
cbMarried:{cx:1819,cy:1295,w:38,h:38,category:"civilStatus"},
cbWidow:{cx:2064,cy:1295,w:38,h:38,category:"civilStatus"}
},

fields:{
/* OPENING PARAGRAPH — I, ___ ... employed as ___ ... Office of ___ */
fullName:{x:292,y:1271,w:904,h:50,fs:24},
employedAs:{x:842,y:1348,w:754,h:50,fs:24},
officeOf:{x:454,y:1420,w:1025,h:50,fs:24},

/* SIGNED THIS ___ DAY OF ___, 20___ AT ___ */
signDay:{x:519,y:2280,w:151,h:50,fs:22},
signMonth:{x:847,y:2280,w:151,h:50,fs:22},
signYear:{x:1091,y:2280,w:91,h:50,fs:22},
signTime:{x:1254,y:2280,w:151,h:50,fs:22},

/* CONTACT DETAILS */
email:{x:404,y:2730,w:664,h:50,fs:22},
mobileNumber:{x:636,y:2793,w:514,h:50,fs:22},
permanentAddr:{x:886,y:2855,w:634,h:50,fs:22}
},

validate:function(vals,miss){
if(!vals.fullName)miss.push("Full Name (I, ___)");
if(!vals.employedAs)miss.push("Presently employed as");
if(!vals.officeOf)miss.push("Office of");
if(!vals.signDay)miss.push("Date today");
if(!vals.signMonth)miss.push("Month today");
if(!vals.signYear)miss.push("Year today");
if(!vals.signTime)miss.push("Time");
if(!vals.mobileNumber)miss.push("Mobile Number");
if(!vals.email)miss.push("Email");
if(!vals.permanentAddr)miss.push("Permanent Address");
},

getResult:function(vals,checkedOf){
var cs=(checkedOf&&checkedOf("civilStatus"))||[];
return{form:"authorityLc",fields:vals,civilStatus:cs.length?cs[0].label:""};
}

});

})();
