'use strict'

window.addEventListener("load", async ()=>{

    let body = document.querySelector("body");
    setTimeout(()=>{
        body.style.overflow = "auto";
    },1000);

    const db = await axios({
        method: 'get',
        url: './users/login'
    });
    if(db.data.code == 0) createDBform();
    else createLoginform();

    //Crear tabla de empleados
    function createEmployeeTable(){
        let headers = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        }

        axios.get('http://localhost:3000/employee/', headers).then(res => {
            //Create Table
            let table = document.createElement("div");
                table.classList.add("table");
                let row = document.createElement('ul');
                let rowValues = ["nombre", "apellidos", "teléfono", "email", "dirección", "estado"];
                    for (let j = 0; j < rowValues.length; j++) {
                        let val = document.createElement('li');
                            val.innerHTML = rowValues[j];
                        row.append(val);
                    }
                table.append(row);
                for (let i = 0; i < res.data.employees.length; i++) {
                    let ul = document.createElement('ul');
                    let {nombre, apellidos, telefono, email, direccion, estado} = res.data.employees[i];
                    if(estado == 0) estado = "inactivo";
                    else estado = "activo";
                    let values = [nombre, apellidos, telefono, email, direccion, estado];
                        for (let j = 0; j < values.length; j++) {
                            let li = document.createElement('li');
                                li.innerHTML = '<input type="text" value="'+values[j]+'">';
                            ul.append(li);
                        }
                    table.append(ul);
                }
            body.append(table);
        });
    };

    //Crear formulario de login
    function createLoginform(){
        let ids = ["email", "password"];
        let defVals = ["etc@etc.com", "12345"];
        let form = document.createElement("div");
            form.classList.add("form");
            form.id = "login-form";
                //Email input
                let label = document.createElement("label");
                    label.for = ids[0];
                    label.innerHTML = ids[0]+': ';
                let input = document.createElement("input");
                    input.type = "text";
                    input.id = ids[0];
                    input.placeholder = defVals[0];
                //Password input
                let label2 = document.createElement("label");
                    label2.for = ids[1];
                    label2.innerHTML = ids[1]+': ';
                let input2 = document.createElement("input");
                    input2.type = "text";
                    input2.id = ids[1];
                    input2.placeholder = defVals[1];
        form.append(label);
        form.append(input);
        form.append(label2);
        form.append(input2);
            let buttonCont = document.createElement("div");
                buttonCont.classList.add("b-cont"); 
                let logButton = document.createElement("button"); 
                    logButton.innerHTML = 'Iniciar Sesión';
                    logButton.addEventListener("click", loadLogin);
                let signButton = document.createElement("button"); 
                    signButton.innerHTML = 'Registrarse';
                    signButton.addEventListener("click", ()=>{
                        deleteForm();
                        createRegisterForm();
                    });
                buttonCont.append(logButton);
                buttonCont.append(signButton);
            form.append(buttonCont);
        body.append(form);
    }
    //Comprobar formulario base de datos
    function loadLogin(){
        let inputs = document.querySelectorAll('#login-form input');
        let flag = true;
        //Verificar que los inputs contengan información
        inputs.forEach(input => { if(input.value == '') flag = false; });
        if(flag){
            axios({
                method: 'post',
                url: 'http://localhost:3000/user/login',
                data: {
                    email: inputs[0].value,
                    password: inputs[1].value,
                }
            }).then(res => {
                //alert(res.data.message);
                localStorage.setItem('token', res.data.token);
                deleteForm();
                createEmployeeTable();
            });
        }else{
            alert("Tienes que llenar todos los campos!!");
        }
    }

    //Crear formulario para registro
    function createRegisterForm(){
        let ids = ["nombre", "apellidos", "telefono", "email", "direccion"];
        let defVals = ["e.j. Juanito", "e.j. Lopez Pérez", "e.j. 44200000", "e.j. juanito@juanito.com", "e.j. Menchaca 116"];
        let form = document.createElement("div");
            form.classList.add("form");
            form.id = "register-form";
            for (let i = 0; i < ids.length; i++) {
                let label = document.createElement("label");
                    label.for = ids[i];
                    label.innerHTML = ids[i]+': ';
                let input = document.createElement("input");
                    input.type = "text";
                    input.id = ids[i];
                    input.placeholder = defVals[i];
                form.append(label);
                form.append(input);
            }
            //Password INPUTS
            let pass = document.createElement("label");
                pass.for = "password";
                pass.innerHTML = 'password: ';
            let passInput = document.createElement("input");
                passInput.type = "password";
                passInput.id = "password";
                passInput.placeholder = "e.j. 12345";
            let pass2 = document.createElement("label");
                pass2.for = "r-password";
                pass2.innerHTML = 'repeat password: ';
            let pass2Input = document.createElement("input");
                pass2Input.type = "password";
                pass2Input.id = "r-password";
                pass2Input.placeholder = "e.j. 12345";
            form.append(pass);
            form.append(passInput);
            form.append(pass2);
            form.append(pass2Input);

            let logButton = document.createElement("button"); 
                logButton.innerHTML = 'Iniciar Sesión';
                logButton.addEventListener("click", ()=>{
                    deleteForm();
                    createLoginform();
                });
            let signButton = document.createElement("button"); 
                signButton.innerHTML = 'Registrarse';
                signButton.addEventListener("click", loadRegister);
            form.append(logButton);
            form.append(signButton);
        body.append(form);
    }
    //Comprobar formulario base de datos
    function loadRegister(){
        let inputs = document.querySelectorAll('#register-form input');
        let flag = true;
        //Verificar que los inputs contengan información
        inputs.forEach(input => { if(input.value == '') flag = false; });
        if(flag){
            axios({
                method: 'post',
                url: 'http://localhost:3000/user/register',
                data: {
                    nombre: inputs[0].value,
                    apellidos: inputs[1].value,
                    telefono: inputs[2].value,
                    email: inputs[3].value,
                    direccion: inputs[4].value,
                    estado: '0',
                    admin: '0',
                    password: inputs[5].value
                }
            }).then(res => {
                alert(res.data.message);
            });
        }else{
            alert("Tienes que llenar todos los campos!!");
        }
    }

    //Crear formulario para base de datos
    function createDBform(){
        let ids = ["host", "user", "password", "name"];
        let defVals = ["localhost", "root", " ", "ajal"];
        let form = document.createElement("div");
            form.classList.add("form");
            form.id = "db-form";
            let title = document.createElement("h2");
                title.innerHTML = 'Ajal System';
                title.classList.add("title");
                let subtitle = document.createElement("span");
                    subtitle.classList.add("subtitle");
                    subtitle.innerHTML = 'Conexión a la base de datos';
                title.append(subtitle);
            form.append(title);
            let cont = document.createElement("div");
                cont.classList.add("cont");
                    let icon = document.createElement("span");
                    icon.classList.add("icon-database");
                cont.append(icon);
                let info = document.createElement("div");
                    info.classList.add("info");
                    for (let i = 0; i < 4; i++) {
                        let label = document.createElement("label");
                            label.for = ids[i];
                            label.innerHTML = ids[i]+': ';
                        let input = document.createElement("input");
                            input.type = "text";
                            input.id = ids[i];
                            input.value = defVals[i];
                        info.append(label);
                        info.append(input);
                    }
                    let buttonCont = document.createElement("div");
                        buttonCont.classList.add("b-cont"); 
                        let submit = document.createElement("button"); 
                            submit.addEventListener("click", loadDB);
                            submit.innerHTML = 'Enviar Información';
                        buttonCont.append(submit);
                    info.append(buttonCont);
                cont.append(info);
            form.append(cont);
        body.append(form);
    }
    //Comprobar formulario base de datos
    function loadDB(){
        let inputs = document.querySelectorAll('#db-form input');
        let flag = true;
        //Verificar que los inputs contengan información
        inputs.forEach(input => { if(input.value == '') flag = false; });
        if(flag){
            axios({
                method: 'post',
                url: 'http://localhost:3000/',
                data: {
                    host: inputs[0].value,
                    user: inputs[1].value,
                    password: inputs[2].value,
                    database: inputs[3].value
                }
            }).then(res => {
                if(res.data.code == 1) alert("Información de la base de datos cargada exitosamente!!");
                else alert("Hubo un error al cargar la información :(");
            });
        }else{
            alert("Tienes que llenar todos los campos!!");
        }
    }
    
    //Borrar formulario activo
    function deleteForm(){
        let form = document.querySelector(".form");
        form.remove();
    }
    
    
});