<script>
import Add from "../components/Add.vue";
export default {
    layout: 'Slider',
    components:{
        Add,
    },
    data(){
        return{
            search: '',
            selectDisable:'全部',
            selectAdmin:'全部',
            filterArr: [],
            filters: {
                search: '',
                added_by: '',
            },
            dialog: false,
            deletedialog: false,
            deleteid: null,
            PwRestdialog: false,
            alert: false,
            page: 1,
            pageCount: 0,
            message: this.$store.getters.Message,
            err_message: this.$store.getters.ErrMessage,
            arr: [],
            countID: 1,
            editedItem: {
                id: null,
                number: '',
                name: '',
                username: '',
                disable: 0,
                admin: 0,
            },
            disableArr: [
                {id: 0, text: '啟用'},
                {id: 1, text: '禁用'}
            ],
            adminArr: [
                {id: 0, text: '一般員工'},
                {id: 1, text: '管理員'}
            ],
        }
    },
    mounted(){
        console.log("selectA:",this.selectAdmin);
        console.log("selectD:",this.selectDisable);
        if(!this.$cookies.get("auth")?.token){ //?=檢查有沒有token 重要
            this.$router.push('/'); 
        }
        else{
            this.$store.dispatch("handUserList",{
                token: this.$cookies.get("auth").token,
            });
            this.$store.dispatch("handIsLogin", true);
        }
    },
    beforeDestroy(){
        clearTimeout();
    },
    computed:{
        headers(){
            return [
                { text: 'ID', value: 'countID', width: '70'},
                { text: '工號', value: 'number'},
                { text: '姓名', value: 'name' },
                { text: '帳號', value: 'username' },
                { text: '狀態', value: 'disable'},
                { text: '身分', value: 'admin', align: 'center'},
                { text: '編輯', value: 'actions', sortable: false },
            ]
        },
        filteredItems() {
            return this.arr.filter((i) => {
                // if (this.selectDisable == '全部') {
                //     return (i.disable === this.selectDisable)
                // }
                // if (this.selectAdmin == '全部') {
                //     return i.admin === this.selectAdmin
                // }
                return  (this.selectDisable === "全部" && this.selectAdmin === "全部") || 
                        (this.selectDisable === "全部" && i.admin === this.selectAdmin) ||
                        (i.disable === this.selectDisable && this.selectAdmin === "全部") ||
                        (i.disable === this.selectDisable && i.admin === this.selectAdmin)
            })
        },
        isUsers(){
            for (const idx in this.$store.getters.UserList) {
                this.$store.getters.UserList[idx].countID = parseInt(idx) + 1;
                console.log(this.$store.getters.UserList[idx].disable);
            }
            this.arr = this.$store.getters.UserList;
            return this.arr
        },
        isEditUsername(){
            this.editedItem.username = this.$store.getters.EditItem.username
            return this.$store.getters.EditItem.username
        },
        isEditName(){
            this.editedItem.name = this.$store.getters.EditItem.name
            return this.$store.getters.EditItem.name
        },
        isEditNumber(){
            this.editedItem.number = this.$store.getters.EditItem.number
            return this.$store.getters.EditItem.number
        },
        isEditDisable(){
            this.editedItem.disable = this.$store.getters.EditItem.disable
            return this.$store.getters.EditItem.disable
        },
        isEditAdmin(){
            this.editedItem.admin = this.$store.getters.EditItem.admin
            return this.$store.getters.EditItem.admin
        },
        Message(){
            console.log("MESSAGE",this.$store.getters.Message);
            this.alert = true;
            this.message = this.$store.getters.Message;
            return this.$store.getters.Message;
        },
        ErrMessage(){
            this.alert = true;
            console.log("ERROR",this.$store.getters.ErrMessage);
            this.err_message = this.$store.getters.ErrMessage;
            return this.$store.getters.ErrMessage;
        },
    },
    methods:{
        editItem(item){
            this.$store.dispatch("handUserListGet",{
                token: this.$cookies.get("auth").token,
                id: item,
            });
            this.dialog = true;
        },
        deletedItem(item){
            console.log("deleted",item);
            this.$store.dispatch("handUserListGet",{
                token: this.$cookies.get("auth").token,
                id: item,
            });
            this.deleteid = item;
            this.deletedialog = true;
        },
        deletedSubmit(){
            this.deletedialog = false;
            console.log(this.deleteid);
            this.$store.dispatch("handUserListDeleted",{
                token: this.$cookies.get("auth").token,
                id: this.deleteid,
            });
            setTimeout(()=>{
              this.$store.dispatch("handClearMsg", 'clear');
              this.$store.dispatch("handClearErrMsg", 'clear');
            }, 3000);
        },
        editSubmit(){
            this.dialog = false;
            this.$store.dispatch("handUserListGetChange",{
                token: this.$cookies.get("auth").token,
                id: this.$store.getters.EditItem.id,
                username: this.editedItem.username,
                number: this.editedItem.number,
                name: this.editedItem.name,
                disable: this.editedItem.disable,
                admin: this.editedItem.admin,
            });
            setTimeout(()=>{
              this.$store.dispatch("handClearMsg", 'clear');
              this.$store.dispatch("handClearErrMsg", 'clear');
            }, 3000);
        },
        pw_reset(){
            this.PwRestdialog = false;
            this.dialog = false;
            this.$store.dispatch("handUserListGetPwReset",{
                token: this.$cookies.get("auth").token,
                id: this.$store.getters.EditItem.id,
            });
            setTimeout(()=>{
              this.$store.dispatch("handClearMsg", 'clear');
              this.$store.dispatch("handClearErrMsg", 'clear');
            }, 3000);
        },
    }
}
</script>

<template>
  <v-app>
        <v-main>
            <v-container class="top-space">
                <v-row justify="center">
                <v-col lg="4" md="4" sm="4" xs="12">
                    <v-alert
                    v-model="alert"
                    v-if="Message !== 'clear'"
                    dense
                    dismissible
                    type="success"
                    >
                    {{Message}}
                    </v-alert>
                    <v-alert
                    v-model="alert"
                    v-if="ErrMessage !== 'clear'"
                    dense
                    dismissible
                    type="error"
                    >
                    {{ErrMessage}}
                    </v-alert>
                </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col lg="12" md="12" sm="12">
                        <v-card dark class="card-padding">
                            <v-card-title>
                                <v-container>
                                    <v-row align="center">
                                        <v-col lg="2" md="2" sm="">
                                            <h3>員工資料</h3>
                                        </v-col>
                                        <v-col lg="2" md="2" sm="2">
                                            <v-select
                                                v-model="selectDisable"
                                                :items="['全部','啟用','禁用']"
                                                label="狀態"
                                               
                                            ></v-select>
                                        </v-col>
                                        <v-col lg="2" md="2" sm="2">
                                            <v-select
                                                v-model="selectAdmin"
                                                :items="['全部','一般員工','管理員']"
                                                label="身分"
                                            ></v-select>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col lg="3" md="4" sm="3">
                                            <v-text-field
                                                v-model="search"
                                                class="input-margin"
                                                append-icon="mdi-magnify"
                                                label="Search"
                                                single-line
                                                hide-details
                                            ></v-text-field>
                                        </v-col>
                                        <v-col lg="2" md="2" sm="2">
                                            <Add />
                                        </v-col>
                                    </v-row>
                                </v-container> 
                            </v-card-title>
                            <v-data-table
                            :headers="headers"
                            :items="filteredItems"
                            :search="search"
                            :loading="!isUsers.length"
                            loading-text="正在載入資料..."
                            :page.sync="page"
                            @page-count="pageCount = $event"
                            :footer-props="{
                                showFirstLastPage: true,
                                firstIcon: 'mdi-chevron-double-left',
                                lastIcon: 'mdi-chevron-double-right',
                                prevIcon: 'mdi-chevron-left',
                                nextIcon: 'mdi-chevron-right',
                                'items-per-page-text':'當前顯示筆數：',
                                'items-per-page-options':[10, 20, 30, 50]
                            }"
                            >
<!-- 編輯 -->
                            <template v-slot:top>
                            <v-dialog
                                v-model="dialog"
                                max-width="500px"
                            >
                                <v-card dark>
                                    <v-card-title>
                                    <span class="text-h5">編輯員工</span>
                                    <v-spacer></v-spacer>
                                    <v-dialog
                                    v-model="PwRestdialog"
                                    width="400"
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn
                                        color="warning"
                                        dark
                                        depressed
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        重製密碼
                                        </v-btn>
                                    </template>

                                    <v-card dark>
                                        <v-card-title class="text-h5 justify-center">
                                        確定要重製 <strong class="primary--text px-3"> {{editedItem.name}} </strong> 的密碼嗎?
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text class="pt-3">
                                        密碼重設後會將員工密碼自動更改為「!Q2w#E4r」，更改後需通知員工自行登入修改密碼
                                        </v-card-text>

                                      

                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="error"
                                            @click="PwRestdialog = false"
                                        >
                                            取消
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            @click="pw_reset"
                                        >
                                            確認
                                        </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                    </v-dialog>
                                    </v-card-title>

                                    <v-card-text>
                                    <v-container>
                                        <v-row>
                                        <v-col
                                            cols="12"
                                            lg="6"
                                            sm="6"
                                            md="6"
                                        >
                                            <v-text-field
                                            v-model="editedItem.name"
                                            label="姓名"
                                            >{{isEditName}}</v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            lg="6"
                                            sm="6"
                                            md="6"
                                        >
                                            <v-text-field
                                            v-model="editedItem.number"
                                            label="工號"
                                            >{{isEditNumber}}</v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            lg="12"
                                            sm="6"
                                            md="12"
                                        >
                                            <v-text-field
                                            v-model="editedItem.username"
                                            label="帳號"
                                            >{{isEditUsername}}</v-text-field>
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
                                            v-model="editedItem.disable"
                                            >{{isEditDisable}}</v-select>
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
                                            v-model="editedItem.admin"
                                            >{{isEditAdmin}}</v-select>
                                        </v-col>
                                        </v-row>
                                    </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        @click="dialog = false"
                                        color="error"
                                        light
                                    >
                                        取消
                                    </v-btn>
                                    <v-btn
                                        color="green darken-1"
                                        @click="editSubmit"
                                    >
                                        儲存
                                    </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        <!-- 刪除確認     -->
                            <v-dialog
                            v-model="deletedialog"
                            width="400"
                            >
                            <v-card dark>
                                <v-card-title class="text-h5 justify-center">
                                確定要刪除 <strong class="primary--text px-3"> {{editedItem.name}} </strong> 嗎?
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="pt-3">
                                刪除後不能更改，如不刪除請點選取消
                                </v-card-text>

                                <!-- <v-divider></v-divider> -->

                                <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="error"
                                    @click="deletedialog = false"
                                >
                                    取消
                                </v-btn>
                                <v-btn
                                    color="primary"
                                    @click="deletedSubmit()"
                                >
                                    確認
                                </v-btn>
                                </v-card-actions>
                            </v-card>
                            </v-dialog>
                            </template>
<!-- 編輯結束 -->
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td>{{ item.countID }}</td>
                                    <td>{{ item.number }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.username }}</td>
                                    <td>{{ item.disable }}</td>
                                    <td>{{ item.admin }}</td>
                                </tr>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    small
                                    class="mr-2"
                                    @click="editItem(item.id)"
                                >
                                    mdi-pencil
                                </v-icon>
                               
                                <v-icon
                                    small
                                    @click="deletedItem(item.id)"
                                >
                                    mdi-delete
                                </v-icon>
                            </template>
                            <template v-slot:footer.page-text>
                                <!-- <v-pagination
                                    class="pt-5"
                                    v-model="page"
                                    :length="pageCount"
                                    :total-visible="7"
                                ></v-pagination> -->
                                第
                                <input
                                    v-model="page"
                                    type="number"
                                    class="shrink pa-2 page"
                                >
                                頁
                            </template>
                            </v-data-table>
                        </v-card>
                    </v-col>
                </v-row> 
            </v-container>   
        </v-main>
  </v-app>
</template>


<style scoped>
.v-main{
  background-color: rgb(22, 22, 22);
}
.title-center{
    text-align: center;
}
.card-padding{
    padding: 0px 20px;
}
.input-margin{
    margin-bottom: 20px;
}
.page{
    background: rgb(44, 44, 44);
    border-radius: 2px;
    color: white;
    text-align: center;
    font-size: 14px;
    width: 39px;
    height: 30px;
    margin: 0 5px;
}
.page:focus{
    outline: none;
    background: rgb(87, 87, 87);
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>