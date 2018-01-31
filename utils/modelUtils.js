exports.getGenderIdFromGender = function(gender) {
  if(gender == "Male"){ return 1; } 
  else if(gender == "Female"){ return 0; } 
  else return null;
};

exports.getAcademicyearIdfromAcademicyear = function(year) {
  if(year == "2017-18"){ return 1; } 
  else if(year == "2018-19"){ return 2; }
  else if(year == "2019-20"){ return 3; } 
  else return null;
};

exports.getIdFromname = function(name, models) {
  console.log(models);
  var id = null;
  models.forEach(model => {
    if(model.attributes.name == name){
      id = model.attributes.id;
    }
  });
  return id;
};

exports.getUserContactsFromUserListAndUserID = function(id, users) {
  var contact = {};
  users.forEach(user => {
    if(user.attributes.id == id){
      contact.email_id = user.attributes.email_id;
      contact.mobile =  user.attributes.mobile;
      contact.name = user.relations.userDetails.attributes.name;
    }
  });
  return contact;
};