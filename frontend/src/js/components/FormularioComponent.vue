<template>
    <div class="container">
        <a v-if="id" href="./index.html" class=""> Volver </a>
        <br>
        <h1>Usuarios</h1>
        <div class="row">
            <div class="col-sm-12">
                <form @submit.prevent="submit">
                    <div v-if="error" class="alert alert-danger" role="alert">
                        {{ msg }}
                    </div>
                    <div v-if="!error && msg" class="alert alert-success" role="alert">
                        {{ msg }}
                    </div>
                    <div class="form-grouo">
                        <img style="width:10%" :src="`${avatar}`">
                    </div>
                    <div class="form-group">
                        <label for="avatar">Avatar</label>
                        <br>
                        <input type="file" id="avatar" @change="onFileChange"/>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input :readonly="(id ? true : false)" type="email" class="form-control" v-model="email" id="email" aria-describedby="emailHelp">
                    </div>
                    <div class="form-group">
                        <div class="row">
                        <div class="col">
                            <label for="nombre">Nombre</label>
                            <input type="text" class="form-control" v-model="nombre" id="nombre" placeholder="Nombre">
                        </div>
                        <div class="col">
                            <label for="apellido">Apellido</label>
                            <input type="text" class="form-control" v-model="apellido" id="apellido" placeholder="Apellido">
                        </div>
                    </div>
                    </div>
                   
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" v-model="password" id="password">
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
            </div>            
        </div>
    </div>    
</template>

<script>

    import axios from "axios";
    
    export default {
        props:['usuarioId'],
        data(){
            return {
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                avatar: '',
                error: false, 
                msg: '',
                usuarios: [],
                id: null
            }
        },
        mounted() {            
            if(this.getURLParameter('id')){
                this.id = this.getURLParameter('id');
                this.getUser();
            }else{
                this.getUsers();
            }
        },
        methods:{
            onFileChange(e) {
                const selectedFile = e.target.files[0];
                this.selectedFile = selectedFile;
            },
            getUsers(){
                axios.get("http://localhost:3000/users")
                .then( res =>{
                    console.log('Res', res.data);
                    this.usuarios = res.data.data;
                });
            },
             getUser(){                
                axios.get(`http://localhost:3000/users/${this.id}`)
                .then( res =>{
                    this.nombre = res.data.nombre;
                    this.apellido = res.data.apellido;
                    this.email = res.data.email;
                    this.avatar = res.data.avatar;
                });

            },         
            getURLParameter(sParam){
                let pageUrl = window.location.search.substring(1);
                let subVar = pageUrl.split('&');
                for (let i = 0; i < subVar.length; i++){
                    let sParameterName = subVar[i].split('=');
                    if (sParameterName[0] == sParam)
                    {
                        return sParameterName[1];
                    }
                }
            },
            create(){

            },
            submit() {
                const formData = new FormData();
                formData.append("avatar", this.selectedFile);
                formData.append("nombre", this.nombre);
                formData.append("apellido", this.apellido);
                formData.append("email", this.email);
                formData.append("password", this.password);

                if(this.id){

                    formData.append("id", this.id);

                    axios
                    .put("http://localhost:3000/user", formData)
                    .then(res => {
                        
                        if(!res.data.success){
                            this.error = true;
                        }

                        this.msg = res.data.msg;     
                        
                        location.reload();                        

                    })
                    .catch(err => {
                        console.log(err);
                    });

                    return;

                }
      
                axios
                .post("http://localhost:3000/users", formData)
                .then(res => {

                    console.log('Res', res);
                    
                    if(!res.data.success){
                        this.error = true;
                    }

                    this.msg = res.data.msg;     
                    
                    location.reload();


                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>