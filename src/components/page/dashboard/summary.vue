<template>
    <div>
        <el-row :gutter="40">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-position grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{MessageRequests}}</div>
                                    <div>请求量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-chat-line-round grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{VisitToday.sendCount}}</div>
                                    <div>日消息量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-chat-dot-square grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{TotalMessages}}</div>
                                    <div>消息总量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            VisitToday: [],
            MessageRequests: [],
            TotalMessages: []
        };
    },
    created() {
        this.getTotalMessages();
        this.getMessageRequests();
        this.getVisitToday();
    },
    methods: {
        async getTotalMessages() {
            const { data: res } = await this.$http.post('/smsInfo/getAllTypeCount');
            if (res.code !== '0000') {
                return $message.error('获取消息总量失败！');
            } else {
                this.TotalMessages = res.data;
            }
        },
        async getMessageRequests() {
            const { data: res } = await this.$http.post('/requestReceiver/getRequestCount');
            if (res.code !== '0000') {
                return $message.error('获取消息请求量失败！');
            } else {
                this.MessageRequests = res.data;
            }
        },
        async getVisitToday() {
            const { data: res } = await this.$http.post('/index/getSmsSendCountYesterday');
            if (res.code !== '0000') {
                return $message.error('获取日消息量失败！');
            } else {
                this.VisitToday = res.data;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
}

.grid-con-1 .grid-num {
    color: #106AFE;
}

.grid-con-1 .grid-con-icon {
    color: #106AFE;
}

.grid-con-1 .grid-con-icon:hover {
    background: #106AFE;
    color: #fff;
}

.grid-con-2 .grid-con-icon {
    color: #006BFF;
}

.grid-con-2 .grid-con-icon:hover {
    background: #006BFF;
    color: #fff;
}

.grid-con-2 .grid-num {
    color: #006BFF;
}

.grid-con-3 .grid-con-icon {
    color: #2A87E4;
}

.grid-con-3 .grid-con-icon:hover {
    background: #2A87E4;
    color: #fff;
}

.grid-con-3 .grid-num {
    color: #2A87E4;
}

.mgb20 {
    margin-bottom: 20px;
}
</style>