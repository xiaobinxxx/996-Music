import {SongLists} from '../../axios/api'
export default {
  data(){
    return {

    }
  },
  created(){

  },
  mounted () {
  },
  methods:{
    getData(){
      SongLists({
        id: 19723756,
      }).then(res =>{

      })
    }
  }
}
