import axios from '../axios'
const buseUrl = 'http://api.mtnhao.com';
function get(url, params) {
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    url: url,
    method: 'GET',
    params: params,
  })
}

function post(url, params) {
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    url: url,
    method: 'POST',
    data: params
  })
}
function webPost(url, params) {
  let formData = new FormData();
  formData.append('songIds','614327394')
  return axios({
    header: {
      'Access-Control-Allow-Origin': '*',
    },
    baseURL: 'http://fm.taihe.com',
    url: url,
    method: 'POST',
    data: formData
  })
}


// 歌曲搜索
export const  SongSearch = params => {
  return get('/search', params)
};
// 歌曲详情
export const  SongDetail = params => {
  return get('/song/detail', params)
};
// 歌曲歌词
export const  SongLyric = params => {
  return get('/lyric', params)
};
// 歌曲推荐列表
export const  RankingList  = params => {
  return get('/toplist/detail', params)
};
// 歌曲推荐列表
export const  RecommendSongList = params => {
  return get('personalized', params)
};
// 歌曲列表
export const  SongLists = params => {
  return get('playlist/detail', params)
};
// 登录
export const  LoginIn = params => {
  return get('user/playlist', params)
};
// 获取歌曲评论
export const  SongComment = params => {
  return get('comment/music', params)
};
// 喜欢歌曲
export const  SongLike = params => {
  return get('like', params)
};
// 获取歌曲列表
// export const  SongList = params => {
//   return get('/restserver/ting', params)
// };

// // 百度歌曲播放
// export const  songlink = params => {
//   return webPost('/data/music/songlink', params)
// };
