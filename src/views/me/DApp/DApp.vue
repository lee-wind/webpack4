<template>
    <wind-container>
        <wind-header>
            <wind-back/>
        </wind-header>
        <wind-body>
            <button @click="getAccountList">getAccountList</button>
            <button @click="showAccountSwitch">showAccountSwitch</button>
            <button @click="account">account</button>
            <button @click="sendTransaction">sendTransaction</button>
            <br/>
            {{list}}
            <br/>
            {{balance}}
            <br>
            {{receipt}}

            <form>
                <div>
                    <label>发送方</label>
                    <input class="bd" type="text" v-model="from">
                </div>
                <div>
                    <label>接收方</label>
                    <input class="bd" type="text" v-model="to">
                </div>
                <div>
                    <label for="">数额</label>
                    <input class="bd" type="text" v-model="amount">
                </div>
                <div class="text-center">
                    <button class="" type="button" @click="sendTransaction">发送</button>
                </div>
            </form>
            <br>
            receipt: {{receipt}}
            hash: {{hash}}
        </wind-body>
    </wind-container>
</template>

<script>
    export default {
        name: "DApp",
        data(){
            return {
                list: [],
                address: '',
                balance: '',
                receipt: '',
                from: '',
                to: '',
                amount: '',
                hash: '',
            }
        },
        methods: {
            getAccountList(){
                if(window.imToken){
                    window.imToken.callAPI('user.getAccountList', (err, list) => {
                        if(err) {
                            alert(err)
                        } else {
                            // alert(list)
                            this.list = list;
                            this.address = this.list[0];
                        }
                    })
                }
            },
            showAccountSwitch(){
                if(window.imToken){
                    window.imToken.callAPI('user.showAccountSwitch', {chainType: null}, function(err, address){
                        if(err) {
                            alert(err.message)
                        } else {
                            alert(address)
                        }
                    })
                }
            },
            account(){
                if(window.web3){
                    alert('获取余额: ' + this.address);
                    window.web3.eth.getBalance(this.address).then(console.log);
                }
            },
            /*sendTransaction(){
                if(window.web3){
                    window.web3.eth.sendTransaction({
                        from: this.from,
                        to: this.to,
                        //value: '1000000000000000'
                        value: this.amount * Math.pow(10, 18) + '',
                    }).then(receipt => {
                        this.receipt = receipt;
                    }).catch(err => {
                        alert(err);
                    })
                }
            }*/
            sendTransaction(){
                let that = this;
                if(window.web3){
                    window.web3.eth.sendTransaction({
                        from: '0xCED52CBd2e18a4E73fDBc6EF54643c9ec1856792',
                        to: '0x336E190B9420E226228F38EE39629b1209b01536',
                        //value: '1000000000000000'
                        value: 0.001 * Math.pow(10, 18) + '',
                    }, function(error, hash){
                        console.log(error);
                        console.log(hash);
                        alert(hash);
                        that.hash = hash;
                    });

                }
            }
        }
    }
</script>

<style scoped>

</style>
