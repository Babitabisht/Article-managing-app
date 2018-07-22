$(document).ready(function(){

    $('.delete_article').on('click',function(e){
console.log('yeah!')
$target =$(e.target);
const id=$target.attr('data-id');
$.ajax({

type:'DELETE' ,
url : '/articles/'+id ,
success:function(respone){
    alert('Deleting Article');
    window.location.href='/'
},error:function(err){
    console.log(err);
}


});

    })
})