<template>
	<div class="container pt-4">
        <h2>Listado de usuarios</h2>
        <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">Imagen de perfil</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Email</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in usuarios" :key="index">
                    <td>
                        <img style="width:10%" :src="`${item.avatar}`">
                    </td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.apellido }}</td>
                    <td>{{ item.email }}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button @click="actualizar(item.id)" type="button" class="btn btn-primary">Modificar</button>
                            <button @click="deleteUser(item.id)" type="button" class="btn btn-danger">Eliminar</button>
                        </div>
                    </td>
                </tr>                
            </tbody>
        </table>
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
                usuarios: []
            }
        },
        mounted() {
            this.getUsers();
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
            deleteUser(id){
                console.log('Borrar id ', id);
                axios.delete(`http://localhost:3000/users/${id}`)
                .then( res =>{

                    if(!res.data.success){
                        this.error = true;
                    }

                    this.msg = res.data.msg;  

                    location.reload();
                });
            },
            actualizar(id){
                window.location.href = `http://localhost/prueba-tecnica-xdevelop/frontend/actualizar.html?id=${id}`
            },
            submit() {

                const formData = new FormData();
                formData.append("avatar", this.selectedFile);
                formData.append("nombre", this.nombre);
                formData.append("apellido", this.apellido);
                formData.append("email", this.email);
                formData.append("password", this.password);
      
                axios
                .put("http://localhost:3000/users", formData)
                .then(res => {
                    
                    if(!res.data.success){
                        this.error = true;
                    }

                    this.msg = res.data.msg;     
                    
                    this.getUsers();

                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>