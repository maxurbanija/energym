var redirect = '';

$(document).ready(function () {
  $(".userID").keydown(function (e) {
   if ((e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
     (e.keyCode >= 35 && e.keyCode <= 40) ||
     $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1) {
     return;
  }
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
     (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
  }

})
});

$(".userID").keyup(function(){

  var user = $('.userID').val();
  switch (user) {
    case 'secretaria':
      redirect ='secretaria/home.html';
      break;
    case 'gerente':
      redirect ='gerente/home.html';
      break;
    case 'entrenador':
      redirect ='entrenador/home.html';
      break;
    default:
      redirect = 'login.html';
      break;
    }
});

$(document).on('click','.login',function(){
  window.location.href = redirect;
  });
