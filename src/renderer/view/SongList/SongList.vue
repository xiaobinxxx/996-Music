<template>
    <div class="page_table">
        <!--        顶部 暂时预留-->
        <div class="song_top"></div>
        <!--        歌曲列表-->
        <div class="song_list">
            <div class="song_title">
                <div class="list" style="width: 50%">
                    <span>歌曲</span>
                </div>
                <div class="list" style="width: 30%">
                    <span>歌手</span>
                </div>
                <div class="list" style="width: 20%">
                    <span>专辑</span>
                </div>
                <!--                <div class="list" style="width: 10%">-->
                <!--                    <span>时长</span>-->
                <!--                </div>-->
            </div>
            <div class="music_list" ref="rew_con" @scroll="scrollPage">
                <div class="list" v-for="(item,index) in SongList" :key="index">
                    <div class="title">
                        <span>{{item.name}}</span>
                        <span class="quality">HQ</span>
                        <div class="control">
                            <span class="iconfont icon-bofang" @click="onPlaySong(item,index)"></span>
                            <span class="iconfont icon-jiahao" @click="onAddSong(item,index)"></span>
                        </div>
                    </div>
                    <div class="singer">
                        <span>{{item.artists[0].name}}</span>
                    </div>
                    <div class="album">
                        <span>{{item.album.name}}</span>
                    </div>
                    <!--                    <div class="duration">-->
                    <!--                        <span>02:22</span>-->
                    <!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SongList from 'SongList'
    export default SongList;
</script>

<style scoped lang="less">
    @import "SongList.less";
</style>
