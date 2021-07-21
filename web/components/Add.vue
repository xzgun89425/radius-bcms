<template>
  <v-row justify="end">
    <v-dialog
      v-model="dialog"
      max-width="500px"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="add-btn"
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          新增員工
        </v-btn>
      </template>
      <v-card dark>
        <v-card-title>
          <span class="text-h5">新增員工</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                lg="6"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="帳號"
                  required
                  v-model="username"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="密碼"
                  :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPwd ? 'text' : 'password'"
                  @click:append="showPwd = !showPwd"
                  v-model="password"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="工號"
                  required
                  v-model="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12"
              lg="6">
                <v-text-field
                  label="姓名"
                  required
                  v-model="name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                sm="6"
              >
                <v-select
                  :items="disableArr"
                  item-text="text"
                  item-value="id"
                  label="狀態"
                  required
                  v-model="disable"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                lg="6"
                sm="6"
              >
                <v-select
                  :items="adminArr"
                  item-text="text"
                  item-value="id"
                  label="身分"
                  required
                  v-model="admin"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="closeAdd"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            @click="addMember"
          >
            新增
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        showPwd: false,
        disableArr: [
            {id: 0, text: '啟用'},
            {id: 1, text: '禁用'}
        ],
        adminArr: [
            {id: 0, text: '一般員工'},
            {id: 1, text: '管理員'}
        ],
        username: "",
        password: "",
        number: "",
        name: "",
        disable: 0,
        admin: 0
    }),
    methods:{
        addMember(){
            this.$store.dispatch("handUserListAdd",{
                token: this.$cookies.get("auth").token,
                username: this.username,
                password: this.password,
                number: this.number,
                name: this.name,
                disable: this.disable,
                admin: this.admin,
            });
            setTimeout(()=>{
                this.$store.dispatch("handClearMsg", 'clear');
                this.$store.dispatch("handClearErrMsg", 'clear');
                this.dialog = false;
                this.username = "";
                this.password = "";
                this.number = "";
                this.name = "";
                this.disable = 0;
                this.admin = 0;
            }, 3000);
            this.dialog = false;
        },
        closeAdd(){
          this.dialog = false;
          this.username = "";
          this.password = "";
          this.number = "";
          this.name = "";
          this.disable = 0;
          this.admin = 0;
        }
    },
    beforeDestroy(){
      clearTimeout();
    },
}
</script>

<style>
    .add-btn{
        margin-right: 20px;
    }
</style>