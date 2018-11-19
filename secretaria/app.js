var today = new Date();
var sexo = "Masculino";

$(function () {
  $("[data-toggle=popover]").popover({
        html: true
    });
})

$(document).tooltip({
    selector: '.tt'
});

$(document).ready(function () {

  $(".fechaDeHoy").html(today.getDate()+"/"+today.getMonth()+"/"+today.getFullYear());
  $(".contentFiltro").hide();
  $(".modal").hide();
  $(".modal-datos").hide();

  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").hide();
  newDis = $(".nuevaDisiplina").html();

  $(".popDis").attr("data-content", newDis);

  getData();

  $("").keydown(function (e) {
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

$(document).on('click','.add-cli',function(){
  $(".newCli").val("");
  $(".bnt-modal-prog").text("Registrar").addClass("regNuevoCli").removeClass("mod-data-btn");
  $(".bnt-modal-cancel").text("Volver").addClass("cerrar").removeClass("save-data-cancel");
  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").show();
  $(".modal").show();
});

$(document).on('click','.popDis',function(){
  $('.popover-header')[0].style.background = "#847191";
  $('.popover-body')[0].style.background = "#ab9ab7";
});


$(document).on('click','.regNuevoCli',function(){
  saveData()
  $(".modal").hide();
  $(".nuevoCli").hide();
  $(".dataCli").hide();
  $(".alertExito").show();
  $(".modal").show();
});

$(document).on('click','.mod-data-btn',function(){
  $(".mod-data-values").prop("disabled" , false);
  $(".mod-data").show();

  $(".bnt-modal-prog").text("Guardar").addClass("save-data-btn").removeClass("mod-data-btn");
  $(".bnt-modal-cancel").text("Cancelar").removeClass("cerrar").addClass("save-data-cancel");
});

$(document).on('click','.save-data-cancel',function(){
  $(".mod-data").prop("disabled" , true);
  $(".mod-data").hide();
});

$(document).on('click','.save-data-btn',function(){
  $(".mod-data-values").attr("disabled" , true);
  $(".mod-data").hide();
  saveData()
  $(".modal").hide();
  $(".nuevoCli").hide();
  $(".dataCli").hide();
  $(".alertExito").show();
  $(".modal").show();
});

$(document).on('click','.close',function(){
  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").hide();
  $(".modal").hide();
});

$(document).on('click','.ver-filtro',function(){
  $(".contentFiltro").show();
  $(".ver-filtro").removeClass("ver-filtro").addClass("nover-filtro")
});

$(document).on('click','.nover-filtro',function(){
  $(".contentFiltro").hide(10);
  $(".nover-filtro").removeClass("nover-filtro").addClass("ver-filtro");

});


$(document).on('click','.cerrar',function(){
  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").hide();
  $(".modal").hide();
});

$(".sexMasc").click(function(){
   var valueCurrent = $(".sexMasc > input").val();
   sexo = valueCurrent;
});

$(".sexFem").click(function(){
   var valueCurrent = $(".sexFem > input").val();
   sexo = valueCurrent;
});
  // Initialize Firebase
var config = {
    apiKey: "AIzaSyC53WX4C8Usk3oSB1EFbKQpRlc69Cqy9ZU",
    authDomain: "disenosantino.firebaseapp.com",
    databaseURL: "https://disenosantino.firebaseio.com",
    projectId: "disenosantino",
    storageBucket: "disenosantino.appspot.com",
    messagingSenderId: "462817892359",
    timestampsInSnapshots: true
  };

firebase.initializeApp(config);

var db = firebase.firestore();

console.log(db.collection("clientes").get());

function saveData() {

    var datos = {};

    var name = $('.nameIn').val();
    if (name) {
      datos.name = name
    }else {
      console.log("debe ingresar un Nombre");
    }
    var dni = $('.dniIn').val();
    if (dni > 0 && dni.toString().length > 7) {
      datos.dni = dni
    }else {
      console.log("Ingrese un DNI Valido");
    }

    datos.sexo = sexo;
    datos.telefono = $('.telIn').val();
    datos.fechanac = $('.fnacIn').val();
    datos.direccion = $('.dirIn').val();
    datos.localidad = $('.locIn').val();
    datos.objetivos = $('.objIn').val();
    datos.fechareg = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();
    console.log(datos);
      //Para Verificacion del Tamaño de Procesos
    if (datos) {
      console.log("salvando...");
      saveFirebase(datos);

    }else{
      console.log("noData..");
      //Si no se puede grabar
  }
}

function saveFirebase(datos) {

    db.collection("clientes").add({
      name:datos.name,
      dni:datos.dni,
      sexo:datos.sexo,
      telefono:datos.telefono,
      fechanac:datos.fechanac,
      direccion:datos.direccion,
      localidad:datos.localidad,
      objetivos:datos.objetivos
    }).then(function (docRef) {

      getData();

    }).catch(function (error) {
        console.error("Error adding document: ", error);
    });
}

function deleteData(idData){

    db.collection("clientes").doc(idData).delete().then(function() {
        console.log("Document successfully deleted!");
        getData();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};

function getData(){

    arrayClientes = [];
    var tabla = document.getElementById('tableId');

    db.collection("clientes").orderBy('name').get().then((querySnapshot) => {

        tabla.innerHTML = '';
        var index = 1;

        querySnapshot.forEach((doc) => {

          var nac = new Date(doc.data().fechanac);
          //today.getDate(),'/'+today.getMonth(),'/'+d.getFullYear()
          var edad = today.getFullYear() - nac.getFullYear();
          tabla.innerHTML += `
            <tr>
                <td class="tdTable" onclick="showClientInfo('${doc.id}');">${doc.data().name}</td>
                <td class="tdTable">${doc.data().dni}</td>
                <td class="tdTable">${doc.data().telefono}</td>
                <td class="tdTable">${edad}</td>
                <td class="tdTable">NO</td>
                <td><a href="asistenciaclien.html" class="button small">Asistencia</a></td>
                <td><a href="cobrocliente.html" class="button small">Cobrar</a></td>
                <td class="tdTable"><button class="button small special" onclick="deleteData('${doc.id}')">Borrar</button></td>
            </tr>
            `;
          index += 1;
          arrayClientes.push(doc.data());
        });
    });
    console.log(arrayClientes)
};



function showClientInfo(idDoc) {
  $(".mod-data-values").prop("disabled" , true);
  $(".mod-data").hide();
  $(".bnt-modal-prog").text("Modificar").removeClass("regNuevoCli").addClass("mod-data-btn");

  $(".bnt-modal-cancel").text("Volver").addClass("cerrar").removeClass("save-data-cancel");

  db.collection("clientes").doc(idDoc).get().then(function(doc) {
    if (doc.exists) {
      console.log("Document successfully founded!");
      loadData(doc.data());
    }else {
      console.log("No document found.");
    }
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });


  $(".alertExito").hide();
  $(".nuevoCli").hide();
  $(".dataCli").show();
  $(".modal").show();
};


function loadData(datos) {
  console.log(datos);
  $(".name").val(datos.name);
  $(".dni").val(datos.dni);
  $(".fnac").val(datos.fechanac);
  $(".tel").val(datos.telefono);
  $(".dir").val(datos.direccion);
  $(".loc").val(datos.localidad);
  $(".obj").val(datos.objetivos);
  $(".fechaDeIn").html(datos.fechareg);
};

function habHora(combo) {
        var value = combo;
        if (value == 1 ) {
            document.getElementById("hora").style.display = "block";
            } else {
              if (value == 2) {
                habacepta();
              } else {
            document.getElementById("hora").style.display = "none";
          }
        }
      };
function habacepta() {
      var value = document.getElementById("aceptar").style.visibility;
      if (value == "hidden") {
          document.getElementById("aceptar").style.visibility = "visible";
              } else {
                  document.getElementById("aceptar").style.visibility = "hidden";
                }
            };




// When the user clicks on <span> (x), close the modal

// When the user clicks anywhere outside of the modal, close it
$(window).click(function(e) {
  if ( e.target.className == "modal") {
    $(".alertExito").hide();
    $(".dataCli").hide();
    $(".nuevoCli").hide();
    $(".modal").hide();
  }
});
