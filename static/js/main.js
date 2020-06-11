'use strict'

window.addEventListener("load", async ()=>{

    let body = document.querySelector("body");
    let activeSearch = false;

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
        axios.post('./employee/',{}, headers).then(res => {
            if(notification && res.data.code == 200){
                //Verify if admin
                if(res.data.employee[0].admin == 0){
                    //Create Full Login
                    generateHeader(false);
                    //Body Content
                    generatePrincipalContent(false);
                    setTimeout(()=>{
                        generateCard(res.data.employee[0], true, false);
                        generateNotification(res.data.message,"var(--verde)");
                        handleScrollBar(false);
                    },300);
                }else{
                    //Create Full Login
                    generateHeader();
                    //Body Content
                    generatePrincipalContent();
                    setTimeout(()=>{
                        generateCard(res.data.employee[0], true);
                        generateNotification(res.data.message,"var(--verde)");
                        handleScrollBar(false);
                    },300);
                }
                
            }
            else if(notification){
                generateNotification(res.data.message,"var(--rojo)");
                localStorage.removeItem('token');
                createLoginform(false);
            } 
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
                                handleScrollBar(false);
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
                if(res.data.code == 200){
                    generateNotification(res.data.message, "var(--verde)");
                    localStorage.setItem('token', res.data.token);
                    deleteForm(()=>{
                        createLoginContent(true);
                    });
                }
                else if(res.data.code == 409){
                    generateNotification(res.data.message, "var(--naranja)");
                } 
                else{
                    generateNotification(res.data.message, "var(--rojo)");
                }
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
                            if(passInput.value != pass2Input.value){
                                generateNotification("Las contraseñas no coinciden","var(--rojo)");
                            }else loadRegister();
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
                        handleScrollBar(false);
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
                if(res.data.code == 200){
                    generateNotification(res.data.message, "var(--verde)");
                    deleteForm(()=>{
                        createLoginform(false);
                    });
                }
                else generateNotification(res.data.message, "var(--rojo)");
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
                            handleScrollBar(false);
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
        handleScrollBar();
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
    function permisionPop(operation, callback, changePassword = false){
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
                        if(changePassword){
                            title.innerHTML = `
                            <h2>Ingresa tu contraseña actual y la nueva contraseña del empleado para confirmar la operación de</h2>
                            <span style="background:var(--rojo);">${operation}</span>
                        `;
                        }else{
                            title.innerHTML = `
                            <h2>Ingrese su contraseña para confirmar la operación de</h2>
                            <span>${operation}</span>
                        `;
                        }
                    info.append(title);
                    if(changePassword){
                        let input = document.createElement("input");
                            input.type = "password";
                            input.placeholder = "Contraseña actual e.j. 12345";
                        let input2 = document.createElement("input");
                            input2.type = "password";
                            input2.placeholder = "Nueva contraseña e.j. 12345";
                        let input3 = document.createElement("input");
                            input3.type = "password";
                            input3.placeholder = "Confirmar nueva contraseña e.j. 12345";
                        let button = document.createElement("button");
                            button.innerHTML = "Confirmar Acción";
                            clickEventHandler(button, ()=>{
                                const values = [input.value, input2.value, input3.value];
                                let flag = true;
                                values.forEach(value => {
                                    if(value.trim().length == 0) flag = false;
                                });
                                if(flag){
                                    if(input2.value != input3.value) generateNotification("La nueva contraseña no coincide con su confirmación","var(--rojo)");
                                    else{
                                        callback(values);
                                        destroyPermisionPop();
                                    }
                                }else generateNotification("Tienes que ingresar la información solicitada para continuar con la operación","var(--rojo)");
                            });
                        info.append(input);
                        info.append(input2);
                        info.append(input3);
                        info.append(button);  
                    }else{
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
                            });
                        info.append(input);
                        info.append(button);  
                    }   
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
    //Cerrar sesión
    function logOut(){
        let token = localStorage.getItem('token');
        if(token) localStorage.removeItem('token');
        handleScrollBar();

        removePrincipalContent(()=>{
            generateNotification("Se ha cerrado la sesión exitosamente","var(--verde)");
            createLoginform(false);
        });
    }
    
    //Generar Header
    function generateHeader(flag = true){
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
                        //Cargar ficha de empleado propia
                        clickEventHandler(button1, ()=>{
                            let headers = {
                                headers: {
                                    'Authorization': "Bearer " + localStorage.getItem("token")
                                }
                            }
                            axios.post('./employee/', {}, headers).then(res => {
                                if(res.data.code == 200){
                                    setTimeout(()=>{
                                        generateCard(res.data.employee[0], true);
                                        handleScrollBar(false);
                                    },300);
                                }
                                else if(notification){
                                    generateNotification(res.data.message,"var(--rojo)");
                                } 
                            });
                        });
                    let button2 = document.createElement("button");
                        button2.innerHTML = 'Cerrar Sesión';
                        clickEventHandler(button2, logOut);
                    if(flag) options.append(button1);
                    options.append(button2);
                cont.append(logo);
                cont.append(options);
            header.append(cont);
        body.append(header);
    }
    //Generar Login-Content
    function generatePrincipalContent(flag = true){
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
                            input.addEventListener("keyup", ()=>{
                                let val = input.value.trim();
                                if(val.length > 3){
                                    setTimeout(()=>{
                                        if(!activeSearch) ajaxSearch(val);
                                    },300);
                                }else{
                                    generateSearchResults([]);
                                }
                            });
                            input.addEventListener("focus", ()=>{
                                let leyend = input.parentElement.querySelector("p");
                                    leyend.classList.add("focus");
                            });
                            input.addEventListener("blur", ()=>{
                                let leyend = input.parentElement.querySelector("p");
                                let search = input.parentElement.parentElement.querySelector(".results");
                                    if(search.innerHTML.trim().length == 0) leyend.classList.remove("focus");
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
            if(flag) loginContent.append(search);
        body.append(loginContent);
    }
    function removePrincipalContent(callback = ()=>{}){
        let header = document.querySelector("header");
        let loginContent = document.querySelector("#login-content");

        header.style.opacity = "0";
        loginContent.style.opacity = "0";
        setTimeout(()=>{
            header.remove();
            loginContent.remove();
            setTimeout(()=>{
                callback();
            },100);
        },200);
    }
    //Generar ficha de Empleado
    function generateCard(info, self = false, flag = true){
        let where = document.querySelector("#login-content .profile");
        let prevCard = document.querySelector("#login-content .profile .profile-card");
        if(prevCard) destroyCard();
        setTimeout(()=>{
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
                        //Obtener confirmación por contraseña
                        permisionPop("Actualización de Datos", (pass)=>{
                            let changes = profileCard.querySelectorAll('input[type="text"], input[type="radio"]:checked');
                            let headers = {
                                headers: {
                                    'Authorization': "Bearer " + localStorage.getItem("token")
                                }
                            };
                            let data = {
                                nombre: changes[0].value,
                                apellidos: changes[1].value,
                                telefono: changes[2].value,
                                email: changes[3].value,
                                direccion: changes[4].value,
                                confirmPassword: pass,
                                token: localStorage.getItem("token")
                            };
                            if(changes.length >= 6){
                                data.estado = parseInt(changes[5].value);
                                data.admin = parseInt(changes[6].value);
                            } 
                            axios.patch('./employee/'+info.idEmpleado, data, headers).then(res => {
                                console.log(res.data);
                                setTimeout(()=>{
                                    const {code, message} = res.data;
                                    if(code == 200){
                                        if(self){
                                            //Reload Token
                                            axios({
                                                method: 'post',
                                                url: './user/login',
                                                data: {
                                                    email: info.email,
                                                    password: pass
                                                }
                                            }).then(res => {
                                                if(res.data.code == 200){
                                                    localStorage.setItem('token', res.data.token);
                                                }
                                            });
                                        }
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
                    clickEventHandler(li2, ()=>{
                        //Obtener confirmación por contraseña
                        permisionPop("Eliminar usuario", (pass)=>{
                            deleteEmployee(info.idEmpleado, pass);
                        });
                    });
                let li3 = document.createElement("li");
                    li3.classList.add("icon-key");
                    li3.title = "Cambiar contraseña del Empleado";
                    //Actualizar contraseña del empleado
                    clickEventHandler(li3, ()=>{
                        //Obtener confirmación por contraseña
                        permisionPop("Actualización de Contraseña", (passwords)=>{
                            let headers = {
                                headers: {
                                    'Authorization': "Bearer " + localStorage.getItem("token")
                                }
                            };
                            let data = {
                                password: passwords[1],
                                confirmPassword: passwords[0],
                            };
    
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
                        }, true);
                    });
                options.append(li1);
                options.append(li3);
                if(!self) options.append(li2);
            if(flag) profileCard.append(options);
        where.append(profileCard);
        },300);
    }
    function destroyCard(){
        let card = document.querySelector("#login-content .profile .profile-card");
        card.style.opacity = 0;
        setTimeout(()=>{
            card.remove();
        },300);
    }
    //Eliminar Empleado
    function deleteEmployee(id, password){
        axios.delete('./employee/'+id, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            },
            data: {
                password: password
            }
          }).then(res => {
                const {code, message} = res.data;
                if(code == 200){
                    generateNotification(message,"var(--verde)");
                    //Vaciar lista de resultados de busqueda
                    generateSearchResults([]);
                    //Generar ficha de Empleado
                    let headers = {
                        headers: {
                            'Authorization': "Bearer " + localStorage.getItem("token")
                        }
                    }
                    axios.post('./employee/', {}, headers).then(res => {
                        if(res.data.code == 200){
                            setTimeout(()=>{
                                generateCard(res.data.employee[0], true);
                                handleScrollBar(false);
                            },300);
                        }
                    });
              }else{
                  generateNotification(message,"var(--rojo)");
              }
          });
    }
    
    //Search
    function ajaxSearch(val){
        activeSearch = true;
        let headers = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        }
        axios.post('./employee/search', {search: val}, headers).then(res => {
            if(res.data.code == 200){
                setTimeout(()=>{
                    activeSearch = false;
                },300);
                generateSearchResults(res.data.employees);
            }
            else generateNotification(res.data.message, "var(--rojo)");
        });
    }
    //Generate Search Results
    function generateSearchResults(results){
        let searchContainer = document.querySelector("#login-content .search .center .results");
            searchContainer.classList.add("close");
            setTimeout(()=>{
                searchContainer.innerHTML = '';
                setTimeout(()=>{
                    results.forEach(elem => {
                        let result = document.createElement("article");
                            clickEventHandler(result, ()=>{
                                //Obtener información y generar ficha de empleado por ID
                                let headers = {
                                    headers: {
                                        'Authorization': "Bearer " + localStorage.getItem("token")
                                    }
                                }
                                axios.post('./employee/', {id: elem.idEmpleado}, headers).then(res => {
                                    if(res.data.code == 200){
                                        //Create Full Login
                                        generateCard(res.data.employee[0]);
                                        handleScrollBar(false);
                                    }
                                    else{
                                        generateNotification(res.data.message,"var(--rojo)");
                                    } 
                                });
                            });
                            result.innerHTML = `
                                <div class="thumb">
                                    <span class="icon-user"></span>
                                </div>
                                <div class="info">
                                    ${elem.nombre} ${elem.apellidos}
                                    <span>${elem.email}</span>
                                </div>
                            `;
                        searchContainer.append(result);
                    });
                    setTimeout(()=>{
                        searchContainer.classList.remove("close");
                    },300);
                },300);
            },300);
    }
    //Scrollbar
    function handleScrollBar(flag = true){
        if(flag){
            body.style = "";
        }
        else{
            body.style.overflow = "auto";
        }
    }
    
});