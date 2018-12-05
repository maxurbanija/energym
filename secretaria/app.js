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
var collectionClientes = db.collection("clientes");


//Variables de Entorno
var today = new Date();
var sexo = "Masculino";
var oblfnac = true;
var oblname = false;
var obldni = false;


// FUNCIONALIDADES DEL SISTEMA

// Funcionalidades Graficas
$(document).tooltip({
    selector: '.tt'
});

$(function () {
  $("[data-toggle=popover]").popover({
        html: true
    });
});

//Seteo Inicial del Sistema
$(document).ready(function () {
  $('.alertRequired').hide();
  $(".bnt-modal-prog").addClass("disabled");

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

  $(".dniIn .nameIn .fnacIn").keydown(function (e) {
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

$(document).on('click','.popModal',function(){
  newDis = $(".nuevaDisciplina").html();
  $(".popDis").html(newDis);
  $(".sel-add-dis-hour").hide();
  $(".btn-add-dis").hide();
  //$(".popDis")[0].style.background = '#ac5abc';
});

$(document).on('change','.sel-add-dis',function(){
  $(".sel-add-dis-hour").show();
  //$(".popDis")[0].style.background = '#ac5abc';
});

$(document).on('change','.sel-add-dis-hour',function(){
  $(".btn-add-dis").show();
  //$(".popDis")[0].style.background = '#ac5abc';
});

$(document).on('click','.btn-add-dis',function(){

  //$(".popDis")[0].style.background = '#ac5abc';
});


$(document).on('click','.popModal',function(){
  popoversH = $('.popover-header');
  popoversB = $('.popover-body');
  for (var i = 0; i < popoversH.length; i++) {
    popoversH[i].style.background = "#847191";
    popoversB[i].style.background = "#ab9ab7";
  }
});

// Funciones del control del Modal
$(window).click(function(e) {
  if ( e.target.className == "modal") {
    $(".alertExito").hide();
    $(".dataCli").hide();
    $(".nuevoCli").hide();
    $(".modal").hide();
  }
});

$(document).on('click','.close',function(){
  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").hide();
  $(".modal").hide();
});

$(document).on('click','.cerrar',function(){
  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").hide();
  $(".modal").hide();
});
//Funcion para Eliminar Clinete de collectionClientes
function deleteCliente(idData){

    collectionClientes.doc(idData).delete().then(function() {
        console.log("Document successfully deleted!");
        getData();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};
//Funcion Para Cargar la Tabla de Clientes
function getData(){

    arrayClientes = [];
    var tabla = document.getElementById('tableId');

    collectionClientes.orderBy('name').get().then((querySnapshot) => {

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
                <td class="tdTable"><button class="button small special" onclick="deleteCliente('${doc.id}')">Borrar</button></td>
            </tr>
            `;
          index += 1;
          arrayClientes.push(doc.data());
        });
    });

};
//Funciones para la Visualizacion de un cliente
function showClientInfo(idDoc) {
  idClient = idDoc;
  $(".bnt-modal").show();
  $(".mod-data-values").prop("disabled" , true);
  $(".mod-data").hide();
  $(".bnt-modal-prog").text("Modificar").removeClass("regNuevoCli").addClass("mod-data-btn").removeClass("disabled");

  $(".bnt-modal-cancel").text("Volver").addClass("cerrar").removeClass("save-data-cancel");

  collectionClientes.doc(idDoc).get().then(function(doc) {
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

function loadData(unCliente) {

  if (unCliente.sexo = "Masculino") {
    $(".textName").text("Sr.:");
  }else {
    $(".textName").text("Sra.:");
  }
  $(".fotoPerfil").prop("src",unCliente.imgperfil);
  $(".name").val(unCliente.name);
  $(".dni").val(unCliente.dni);
  $(".fnac").val(unCliente.fechanac);
  $(".tel").val(unCliente.telefono);
  $(".dir").val(unCliente.direccion);
  $(".loc").val(unCliente.localidad);
  $(".obj").val(unCliente.objetivos);
  $(".fechaDeIn").html(unCliente.fechareg);
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


//INTERFAZ DE MODIFICACION DE UN CLIENTE
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
  guardarDatosCliente();
  $(".modal").hide();
  $(".nuevoCli").hide();
  $(".dataCli").hide();
  $(".alertExito").show();
  $(".modal").show();
});


//INTERFAZ DE LA GRILLA
$(document).on('click','.ver-filtro',function(){
  $(".contentFiltro").show();
  $(".ver-filtro").removeClass("ver-filtro").addClass("nover-filtro")
});

$(document).on('click','.nover-filtro',function(){
  $(".contentFiltro").hide(10);
  $(".nover-filtro").removeClass("nover-filtro").addClass("ver-filtro");

});





// FUNCIONES PARA EL CU Registrar Cliente
//Clase Cliente
class Cliente {
  constructor(datos) {
    this.name = datos.name;
    this.dni = datos.dni;
    this.sexo = datos.sexo;
    this.telefono = datos.telefono;
    this.fechanac = datos.fechanac;
    this.direccion = datos.direccion;
    this.localidad = datos.localidad;
    this.fechareg = datos.fechareg;
  }

};
//Objeto Temporal Cliente
var unCliente = {};
//FUNCIONES DE INTERFAZ UIAlta_Cliente

//Boton Regisrar Nuevo Cliente
$(document).on('click','.add-cli',function(){
  $(".newCli").val("");
  $(".bnt-modal").show();
  $(".bnt-modal-prog").text("Registrar").addClass("regNuevoCli").removeClass("mod-data-btn");
  $(".bnt-modal-cancel").text("Volver").addClass("cerrar").removeClass("save-data-cancel");
  $(".alertExito").hide();
  $(".dataCli").hide();
  $(".nuevoCli").show();
  $(".modal").show();
});


//Boton de "Cofirmar" REGISTRAR
$(document).on('click','.regNuevoCli',function(){
  //guardarDatosCliente();
  var classCliente = new Cliente(unCliente);
  saveCliente(unCliente);
  $(".bnt-modal").hide();
  $(".modal").hide();
  $(".nuevoCli").hide();
  $(".dataCli").hide();
  $(".alertExito").show();
  $(".modal").show();

});

//FUNCIONES DE CONTROL CTRLAlta_CLiente
// ValidarDatos()
//Funcion que lee los Datos
$(document).on('change','.nuevoCli',function() {


    unCliente.name = $('.nameIn').val();
    unCliente.dni = $('.dniIn').val();

    //perfil = $("imgPerfilIn").val();
    //if (perfil) {
      //unCliente.imgperfil = perfil;
    //  $("fotoPerfil").prop("src", unCliente.imgperfil);
  //  };
    unCliente.sexo = sexo;
    unCliente.telefono = $('.telIn').val();
    unCliente.fechanac = $('.fnacIn').val();
    unCliente.direccion = $('.dirIn').val();
    unCliente.localidad = $('.locIn').val();
    var objeti = $('.objIn').val();
    if (objeti.length > 0) {
      unCliente.objetivos = objeti
    }
    unCliente.fechareg = today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate();

      //
    if (unCliente) {
      console.log("salvando...");

      //saveCliente(unCliente);

    }else{
      console.log("noData..");
      //Si no se puede grabar
  }
});

  $(".dniIn").keyup(function(){
  var dni = $('.dniIn').val();
  if (dni > 0 && dni.toString().length > 7) {
    obldni = true;
    $('.alertRequired').hide();
    if (obldni && oblfnac && oblname) {
      $(".bnt-modal-prog").removeClass("disabled");
    }
  }else {
    obldni = false;
    $(".bnt-modal-prog").addClass("disabled");
    $('.alertRequired').text("Debe ingresar un DNI valido.").show();
  }
 });

  $(".nameIn").keyup(function(){
   var name = $('.nameIn').val();
   if ( name.length > 2) {
     oblname = true;
     $('.alertRequired').hide();
     if (obldni && oblfnac && oblname) {
       $(".bnt-modal-prog").removeClass("disabled");
     }
   }else {
     oblname = false;
     $(".bnt-modal-prog").addClass("disabled");
     $('.alertRequired').text("Debe ingresar un Nombre.").show();
   }
  });

  // $(".fnacIn").keyup(function(){
  //   var fecha = new Date($('.fnacIn').val());
  //   if (fecha) {
  //     if ((fecha - today) < 0 ) {
  //       oblfnac = true;
  //       $('.alertRequired').hide();
  //       if (obldni && oblfnac && oblname) {
  //         $(".bnt-modal-prog").removeClass("disabled");
  //       }
  //
  //     }else {
  //       oblfnac = false;
  //       $(".bnt-modal-prog").addClass("disabled");
  //       $('.alertRequired').text("La fecha no puede ser mayor a la de hoy.").show();
  //     }
  //   }else {
  //     oblfnac = false;
  //     $(".bnt-modal-prog").addClass("disabled");
  //     $('.alertRequired').text("Debe ingresar una fecha.").show();
  //   }
  //  });

  $(".sexMasc").click(function(){
    var valueCurrent = $(".sexMasc > input").val();
    $(".textName").text("Sr.:");
    sexo = valueCurrent;
 });

  $(".sexFem").click(function(){
    var valueCurrent = $(".sexFem > input").val();
    $(".textName").text("Sra.:");
    sexo = valueCurrent;
 });



//Funcion del Sistema que almacena el cliente
function saveCliente(unCliente) {
  //se agrega el cliente a la collectionClientes
    collectionClientes.add(
      unCliente
    ).then(function (docRef) {
      getData();

    }).catch(function (error) {
        console.error("Error adding document: ", error);
    });
};
