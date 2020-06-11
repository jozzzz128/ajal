'use strict'

window.addEventListener("load", async ()=>{

    let body = document.querySelector("body");
    setTimeout(()=>{
        body.style.overflow = "auto";
    },1000);

    try {
        const db = await axios({
            method: 'get',
            url: './user/',
            data: {}
        });
        if(db.data.code == 0) createDBform();
        else{
            const session = localStorage.getItem('token');
            if(session){
                createLoginContent(true);
            }else{
                createLoginform();
            }
        }
    } catch (error) {
        console.log(error);
    }

    //Cargar información post inicio de sesión
    function createLoginContent(notification = false){
        let headers = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        }
        axios.post('./employee/', {}, headers).then(res => {
            if(notification && res.data.code == 200){
                //Create Full Login
                generateHeader();
                //Body Content
                generatePrincipalContent();
                setTimeout(()=>{
                    generateCard(res.data.employee[0], true);
                    generateNotification(res.data.message,"var(--verde)");
                },300);
            }
            else if(notification) generateNotification(res.data.message,"var(--rojo)");
        });
    }

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
                deleteForm(createLoginContent);
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
    function clickEventHandler(obj, callback, reload = true){
        obj.addEventListener("click", eventHandler);

        function eventHandler(){
            callback();
            obj.removeEventListener("click", eventHandler);
            if(reload){
                setTimeout(()=>{
                    obj.addEventListener("click", eventHandler);
                },500);
            }
        }
    }
    //Evento popUp password
    function permisionPop(operation, callback){
        let pop = document.createElement("div");
            pop.id = "permition-prompt";
            let background = document.createElement("div");
                background.classList.add("background");
                clickEventHandler(background, ()=>{
                    destroyPermisionPop();
                    generateNotification("Se ha cancelado la operación","var(--naranja)");
                });
            let content = document.createElement("div");
                content.classList.add("content");
                content.classList.add("off");
                let x = document.createElement("span");
                    x.classList.add("icon-x");
                    x.title = "Cancelar operación";
                    clickEventHandler(x, ()=>{
                        destroyPermisionPop();
                        generateNotification("Se ha cancelado la operación","var(--naranja)");
                    },false);
                let info = document.createElement("div");
                    info.classList.add("info");
                    let title = document.createElement("div");
                        title.classList.add("title");
                        title.innerHTML = `
                            <h2>Ingrese su contraseña para confirmar la operación de</h2>
                            <span>${operation}</span>
                        `;
                    let input = document.createElement("input");
                        input.type = "password";
                        input.placeholder = "e.j. 12345";
                    let button = document.createElement("button");
                        button.innerHTML = "Confirmar Acción";
                        clickEventHandler(button, ()=>{
                            const value = input.value;
                            if(value.trim().length != 0){
                                callback(value);
                                destroyPermisionPop();
                            }else generateNotification("Tienes que ingresar tu contraseña para continuar con la operación","var(--rojo)");
                        },false);
                    info.append(title);
                    info.append(input);
                    info.append(button);        
                content.append(info);
                content.append(x);
            pop.append(background);
            pop.append(content);
        body.append(pop);
        //Animation
        setTimeout(()=>{
            document.querySelector("#permition-prompt .content").classList.remove("off");
        },300);
    }
    function destroyPermisionPop(){
        let pop = document.querySelector("#permition-prompt");
        let cont = pop.querySelector(".content");
        cont.classList.add("hide");
        setTimeout(()=>{
            pop.classList.add("hide");
            setTimeout(()=>{
                pop.remove();
            } ,300);
        },500);
    }
    
    //Generar Header
    function generateHeader(){
        let header = document.createElement("header");
            let cont = document.createElement("div");
                cont.classList.add("cont");
                let logo = document.createElement("h2");
                    logo.classList.add("logo");
                    logo.innerHTML = 'Ajal System<span>Panel de Control</span>';
                let options = document.createElement("ul");
                    options.classList.add("options");
                    let button1 = document.createElement("button");
                        button1.innerHTML = 'Editar Perfil';
                    let button2 = document.createElement("button");
                        button2.innerHTML = 'Cerrar Sesión';
                    options.append(button1);
                    options.append(button2);
                cont.append(logo);
                cont.append(options);
            header.append(cont);
        body.append(header);
    }
    //Generar Login-Content
    function generatePrincipalContent(){
        let loginContent = document.createElement("div");
            loginContent.id = "login-content";
            let profile = document.createElement("div");
                profile.classList.add("profile");
                let h2 = document.createElement("h2");
                    h2.innerHTML = '<span>Ficha de Empleado</span>';
                profile.append(h2);
            loginContent.append(profile);
            //Search Bar
            let search = document.createElement("div");
                search.classList.add("search");
                let center = document.createElement("div");
                    center.classList.add("center");
                    let searchC = document.createElement("div");
                        searchC.classList.add("search-c");
                        let input = document.createElement("input");
                            input.type = "text";
                            input.placeholder = "Busca un empleado";
                            input.addEventListener("change", ()=>{
                                let val = input.value.trim();
                                /*if(val.length > 3)
                                    ajaxSearch(val);lol*/
                            });
                            input.addEventListener("focus", ()=>{
                                let leyend = input.parentElement.querySelector("p");
                                    leyend.classList.add("focus");
                            });
                            input.addEventListener("blur", ()=>{
                                let leyend = input.parentElement.querySelector("p");
                                    leyend.classList.remove("focus");
                            });
                        let p = document.createElement("p");
                            p.innerHTML = 'Se puede realizar una busqueda ya sea por nombre, apellidos, teléfono, email, correo o dirección';
                        searchC.append(input);
                        searchC.append(p);
                    center.append(searchC);
                    let results = document.createElement("div");
                        results.classList.add("results");
                    center.append(results);
                search.append(center);
            loginContent.append(search);
        body.append(loginContent);
        //Cargando la profile card del usuario logeado
    }
    //Generar ficha de Empleado
    function generateCard(info, self = false){
        let where = document.querySelector("#login-content .profile");
        let profileCard = document.createElement("div");
            profileCard.classList.add("profile-card");
            let left = document.createElement("div");
                left.classList.add("left");
                left.innerHTML = `
                <div class="part">
                    <div class="thumb">
                        <span class="icon-user"></span>
                    </div>
                </div>
                <div class="part">
                    <div class="info">
                        <input type="text" value="${info.nombre}" placeholder="${info.nombre}">
                        <input type="text" value="${info.apellidos}" placeholder="${info.apellidos}">
                    </div>
                </div>
                `;
            profileCard.append(left);
            if(self){
                let right = document.createElement("div");
                right.classList.add("right");
                let estado = 'ACTIVO';
                if(info.estado == 0) estado = 'Inactivo';
                let admin = 'si';
                if(info.admin == 0) admin = 'no';
                right.innerHTML = `
                <ul>
                        <li><input type="text" value="${info.telefono}" placeholder="${info.telefono}">Télefono</li>
                        <li><input type="text" value="${info.email}" placeholder="${info.email}"> Email</li>
                        <li><input type="text" value="${info.direccion}" placeholder="${info.direccion}">Dirección</li>
                        <li><label class="off">${estado}</label>Estado</li>
                        <li><label class="off">${admin}</label>Admin</li>
                </ul>
                `;
            profileCard.append(right);
            }else{
                let right = document.createElement("div");
                right.classList.add("right");
                let estado = '<input type="radio" name="estado" id="active" value="1"><input type="radio" name="estado" id="inactive" value="0" checked>';
                if(info.estado == 1) estado = '<input type="radio" name="estado" id="active" value="1" checked><input type="radio" name="estado" id="inactive" value="0">';

                let admin = '<input type="radio" name="admin" id="active2" value="1"><input type="radio" name="admin" id="inactive2" value="0" checked>';
                if(info.admin == 1) admin = '<input type="radio" name="admin" id="active2" value="1" checked><input type="radio" name="admin" id="inactive2" value="0">';
                right.innerHTML = `
                <ul>
                        <li><input type="text" value="${info.telefono}" placeholder="${info.telefono}">Télefono</li>
                        <li><input type="text" value="${info.email}" placeholder="${info.email}"> Email</li>
                        <li><input type="text" value="${info.direccion}" placeholder="${info.direccion}">Dirección</li>
                        <li>${estado}<label class="active" for="inactive">Activo</label><label class="inactive" for="active">Inactivo</label>Estado</li>
                        <li>${admin}<label class="active" for="inactive2">Si</label><label class="inactive" for="active2">No</label>Admin</li>
                </ul>
                `;
            profileCard.append(right);
            }
            let options = document.createElement("ul");
                options.classList.add("options");
                let li1 = document.createElement("li");
                    li1.classList.add("icon-edit");
                    li1.title = "Guardar cambios de la ficha";
                    //Actualizar cambios realizados a la ficha
                    clickEventHandler(li1, ()=>{
                        //Ask for a password confirmation
                        permisionPop("Actualización de Datos", (pass)=>{

                            let headers = {
                                headers: {
                                    'Authorization': "Bearer " + localStorage.getItem("token")
                                }
                            };
                            let data = {
                                confirmPassword: pass,
                                token: localStorage.getItem("token")
                            };
                            let changes = profileCard.querySelectorAll('input[type="text"], input[type="radio"]:checked');
                            if(changes.length >= 1) data.nombre = changes[0].value;
                            if(changes.length >= 2) data.apellidos = changes[1].value;
                            if(changes.length >= 3) data.telefono = changes[2].value;
                            if(changes.length >= 4) data.email = changes[3].value;
                            if(changes.length >= 5) data.direccion = changes[4].value;
                            if(changes.length >= 6) data.estado = parseInt(changes[5].value);
                            if(changes.length >= 7) data.admin = parseInt(changes[6].value);
    
                            axios.patch('./employee/'+info.idEmpleado, data, headers).then(res => {
                                console.log(res.data);
                                setTimeout(()=>{
                                    const {code, message} = res.data;
                                    if(code == 200){
                                        generateNotification(message, "var(--verde)");
                                    }
                                    else generateNotification(message, "var(--rojo)");
                                },300);
                            });

                        });
                    });
                let li2 = document.createElement("li");
                    li2.classList.add("icon-x");
                    li2.title = "Eliminar al Empleado";
                let li3 = document.createElement("li");
                    li3.classList.add("icon-key");
                    li3.title = "Cambiar contraseña del Empleado";
                options.append(li1);
                options.append(li2);
                options.append(li3);
            profileCard.append(options);
        where.append(profileCard);
    } 
    
});