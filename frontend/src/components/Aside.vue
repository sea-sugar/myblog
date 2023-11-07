<template>
     <el-aside width="400px" role="menubar" class="testaside">
        <!-- 通过在 el-aside 元素上添加 role="menubar"，你告诉辅助技术工具（如屏幕阅读器）该元素是一个菜单栏的父元素。 -->
        <el-row class="tac">
            <el-col :span="12">
                <h5 class="mb-2">菜单栏</h5>
                <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @select="handleMenuSelect"
                    @open="handleOpen"
                    @close="handleClose"
                >   

                    <el-sub-menu index="1">
                        <!-- 第一个父下拉菜单 -->
                        <template #title>
                            <el-icon><location /></el-icon>
                            <span>测试</span>
                        </template>

                        <!-- 第一个下拉菜单的第一个子菜单群 -->
                        <el-menu-item-group title="Group One">
                            <el-menu-item index="1-1">test-1</el-menu-item>
                            <el-menu-item index="1-2">test-2</el-menu-item>
                        </el-menu-item-group>

                        <!-- 第一个下拉菜单的第二个子菜单群 -->
                        <el-menu-item-group title="Group Two">
                            <el-menu-item index="1-3">test-3</el-menu-item>
                        </el-menu-item-group>

                        <!-- 第一个下拉菜单的第三个子下拉菜单 -->
                        <el-sub-menu index="1-4">
                            <template #title>Group Three</template>
                            <el-menu-item index="1-4-1">test-4</el-menu-item>
                        </el-sub-menu>

                    </el-sub-menu>

                    <el-menu-item index="2">
                        <el-icon><icon-menu /></el-icon>
                        <span>个人简历</span>
                    </el-menu-item>

                    <el-menu-item index="3" disabled>
                        <!-- disabled 不可点击 -->
                        <el-icon><document /></el-icon>
                        <span>个人发展</span>
                    </el-menu-item>

                    <el-menu-item index="4">
                        <el-icon><setting /></el-icon>
                        <span>个人博客</span>
                    </el-menu-item>

                </el-menu>
            </el-col>
        </el-row>
      </el-aside>
</template>

<script>
    props: ['menuItems'];
    export default {
        data() {
            return {
                selectedMenu: "1-1", // 默认选中的菜单项
            };
        },
        methods: {
            handleOpen(index) {
                this.selectedMenu = index;
            },
            handleClose() {
                // 处理菜单关闭事件
            },
            handleMenuSelect( index ) {
                this.selectedMenu = index;
            },
        },
    }
</script>
