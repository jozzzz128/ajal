'use strict'

window.addEventListener("load", async ()=>{

    let body = document.querySelector("body");
    setTimeout(()=>{
        body.style.overflow = "auto";
    },1000);

    try {
        const db = await axios({
            method: 'post',
            url: './user/login',
            data: {}
        });
        if(db.data.code == 0) createDBform();
        else{
            createLoginform();
        }
    } catch (error) {
        console.log(error);
    }

    //Crear tabla de empleados
    function createEmployeeTable(){
        let headers = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        }

        axios.get('./employee/', headers).then(res => {
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
    function createLoginform(notificationPop = true){
        let ids = ["email", "password"];
        let defVals = ["admin@admin.com", "root"];
        let form = document.createElement("div");
            form.classList.add("form");
            form.classList.add("off");
            form.id = "login-form";
            let cont = document.createElement("div");
                cont.classList.add("cont");
                let thumb = document.createElement("div");
                    thumb.classList.add("thumb");
                    let icon = document.createElement("span");
                        icon.classList.add("icon-key");
                    let title = document.createElement("h2");
                        title.innerHTML = 'Ajal System';
                        title.classList.add("title");
                        let subtitle = document.createElement("span");
                            subtitle.classList.add("subtitle");
                            subtitle.innerHTML = 'Inicio de Sesión';
                        title.append(subtitle);
                    thumb.append(icon);
                    thumb.append(title);
                let info = document.createElement("div");
                    info.classList.add("info");
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
                        input2.type = "password";
                        input2.id = ids[1];
                        input2.placeholder = defVals[1];
                    info.append(label);
                    info.append(input);
                    info.append(label2);
                    info.append(input2);
                    let buttonCont = document.createElement("div");
                        buttonCont.classList.add("b-cont"); 
                        let logButton = document.createElement("button"); 
                            logButton.innerHTML = 'Iniciar Sesión';
                            clickEventHandler(logButton, loadLogin);
                        let signButton = document.createElement("button"); 
                            signButton.innerHTML = 'Registrarse';
                            clickEventHandler(signButton, ()=>{
                                deleteForm(()=>{
                                    createRegisterForm();
                                    setTimeout(()=>{
                                        generateNotification('Para registrarte como empleado completa la siguiente información','var(--azul)');
                                    },800);
                                });
                            });
                        buttonCont.append(logButton);
                        buttonCont.append(signButton);
                    info.append(buttonCont);
                cont.append(thumb);
                cont.append(info);
            form.append(cont);
        body.append(form);
        //Animations
        setTimeout(()=>{
            let form  = document.querySelector("body .form");
                form.classList.add("margin");
                setTimeout(()=>{
                        form.classList.remove("margin");
                        form.classList.remove("off");
                        if(notificationPop){
                            setTimeout(()=>{
                                generateNotification('Bienvenido de regreso, ingresa tus credenciales para iniciar sesión','var(--azul)');
                            },200);
                        }
                },300);
        },300);
    }
    function loadLogin(){
        let inputs = document.querySelectorAll('#login-form input');
        let flag = true;
        //Verificar que los inputs contengan información
        inputs.forEach(input => { if(input.value == '') flag = false; });
        if(flag){
            axios({
                method: 'post',
                url: './user/login',
                data: {
                    email: inputs[0].value,
                    password: inputs[1].value,
                }
            }).then(res => {
                if(res.data.code == 200) generateNotification(res.data.message, "var(--verde)");
                localStorage.setItem('token', res.data.token);
                deleteForm(createEmployeeTable);
            });
        }else{
            generateNotification('Tienes que llenar todos los campos para continuar','var(--naranja)');
        }
    }

    //Crear formulario para registro
    function createRegisterForm(){
        let ids = ["nombre", "apellidos", "telefono", "email", "direccion"];
        let defVals = ["e.j. Juanito", "e.j. Lopez Pérez", "e.j. 44200000", "e.j. juanito@juanito.com", "e.j. Menchaca 116"];
        let form = document.createElement("div");
            form.classList.add("form");
            form.classList.add("off");
            form.id = "register-form";
            let cont = document.createElement("div");
                cont.classList.add("cont");
                let thumb = document.createElement("div");
                    thumb.classList.add("thumb");
                    let icon = document.createElement("span");
                        icon.classList.add("icon-user-plus");
                    let title = document.createElement("h2");
                        title.innerHTML = 'Ajal System';
                        title.classList.add("title");
                        let subtitle = document.createElement("span");
                            subtitle.classList.add("subtitle");
                            subtitle.innerHTML = 'Registro de Empleados';
                        title.append(subtitle);
                    thumb.append(icon);
                    thumb.append(title);
                let info = document.createElement("div");
                    info.classList.add("info");
                    for (let i = 0; i < ids.length; i++) {
                        let label = document.createElement("label");
                            label.for = ids[i];
                            label.innerHTML = ids[i]+': ';
                        let input = document.createElement("input");
                            input.type = "text";
                            input.id = ids[i];
                            input.placeholder = defVals[i];
                        info.append(label);
                        info.append(input);
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
                    info.append(pass);
                    info.append(passInput);
                    info.append(pass2);
                    info.append(pass2Input);
                    let buttonCont = document.createElement("div");
                        buttonCont.classList.add("b-cont"); 
                    let logButton = document.createElement("button"); 
                        logButton.innerHTML = 'Iniciar Sesión';
                        clickEventHandler(logButton, ()=>{
                            deleteForm(createLoginform);
                        });
                    let signButton = document.createElement("button"); 
                        signButton.innerHTML = 'Registrarse';
                        clickEventHandler(signButton, ()=>{
                            loadRegister();
                        });
                    buttonCont.append(logButton);
                    buttonCont.append(signButton);
                    info.append(buttonCont);
                cont.append(thumb);
                cont.append(info);
            form.append(cont);
        body.append(form);
        //Animations
        setTimeout(()=>{
            let form  = document.querySelector("body .form");
                form.classList.add("margin");
                setTimeout(()=>{
                        form.classList.remove("margin");
                        form.classList.remove("off");
                },300);
        },300);
    }
    function loadRegister(){
        let inputs = document.querySelectorAll('#register-form input');
        let flag = true;
        //Verificar que los inputs contengan información
        inputs.forEach(input => { if(input.value == '') flag = false; });
        if(flag){
            axios({
                method: 'post',
                url: './user/register',
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
            generateNotification('Tienes que llenar todos los campos para continuar','var(--naranja)');
        }
    }

    //Crear formulario para base de datos
    function createDBform(){
        let ids = ["host", "user", "password", "name"];
        let defVals = ["localhost", "root", " ", "ajal"];
        let form = document.createElement("div");
            form.classList.add("form");
            form.classList.add("off");
            form.id = "db-form";
            let cont = document.createElement("div");
                cont.classList.add("cont");
                let thumb = document.createElement("div");
                    thumb.classList.add("thumb");
                    let icon = document.createElement("span");
                        icon.classList.add("icon-database");
                    let title = document.createElement("h2");
                        title.innerHTML = 'Ajal System';
                        title.classList.add("title");
                        let subtitle = document.createElement("span");
                            subtitle.classList.add("subtitle");
                            subtitle.innerHTML = 'Base de Datos';
                        title.append(subtitle);
                    thumb.append(icon);
                    thumb.append(title);
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
                            clickEventHandler(submit, loadDB);
                            submit.innerHTML = 'Enviar Información';
                        buttonCont.append(submit);
                    info.append(buttonCont);
                cont.append(thumb);
                cont.append(info);
            form.append(cont);
        body.append(form);
        //Animations
        setTimeout(()=>{
            let form  = document.querySelector("body .form");
                form.classList.add("margin");
                setTimeout(()=>{
                        form.classList.remove("margin");
                        form.classList.remove("off");
                        setTimeout(()=>{
                            generateNotification("Por favor ingresa la información de conexión a la base de datos de MySQL","var(--azul)");
                        },300);
                },300);
        },300);
    }
    function loadDB(){
        let inputs = document.querySelectorAll('#db-form input');
        let flag = true;
        //Verificar que los inputs contengan información
        inputs.forEach(input => { if(input.value == '') flag = false; });
        if(flag){
            axios({
                method: 'post',
                url: './user/login',
                data: {
                    host: inputs[0].value,
                    user: inputs[1].value,
                    password: inputs[2].value,
                    database: inputs[3].value
                }
            }).then(res => {
                if(res.data.code == 1){
                    setTimeout(()=>{
                        generateNotification(res.data.message,"var(--verde)");
                        setTimeout(()=>{
                            generateNotification('Usuario "admin@admin.com" con contraseña "root" creado, inicia sesión y cambia la contraseña','var(--azul)');
                            deleteForm(()=>{
                                createLoginform(false);
                            });
                        },2000);
                    },300);
                }
                else generateNotification(res.data.message,"var(--rojo)");
            }).catch(err => {
                console.log(err);
                generateNotification("No se pudo establecer conexión con la base de datos, vuelvelo a intentar","var(--naranja)");
            });
        }else{
            generateNotification("Tienes que llenar todos los campos, o minimo colocar un espacio","var(--rojo)");
        }
    }

    //Generar notificación
    function generateNotification(text, color){
        destroyNotification();
        setTimeout(()=>{
            let not = document.createElement("div");
            not.id = "notification";
            let info = document.createElement("p");
                info.innerHTML = text;
                info.style.background = color;
                clickEventHandler(info, ()=>{
                    destroyNotification(not);
                });
            not.append(info);
            body.append(not);
            setTimeout(()=>{
                destroyNotification(not);
            }, 10000);
        },200);
    }   
    function destroyNotification(not = document.querySelector("#notification")){
        if(not){
            not.style.transform = "translateY(100px)";
            setTimeout(()=>{
                not.remove();
            },200);
        }
    }

    //Borrar formulario activo
    function deleteForm(callback){
        let form = document.querySelector(".form");
        form.classList.add("hide");
        setTimeout(()=>{
            form.classList.add("off");
            form.classList.add("margin");
            setTimeout(()=>{
                form.classList.remove("margin");
                setTimeout(()=>{
                    form.classList.add("fade");
                    setTimeout(()=>{
                        form.remove();
                        callback();
                    },200);
                },200);
            },200);
        },200);
        //form.remove();

    }
    //Evento notificación
    function clickEventHandler(obj, callback){
        obj.addEventListener("click", eventHandler);

        function eventHandler(){
            callback();
            obj.removeEventListener("click", eventHandler);
            setTimeout(()=>{
                obj.addEventListener("click", eventHandler);
            },500);
        }
    } 
    
});