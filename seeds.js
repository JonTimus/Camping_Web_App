var mongoose    = require("mongoose"),
    CampGround  = require("./models/campground"),
    Comment     = require("./models/comment");


var data = [
    {
        name: "Tash City", 
        image: "https://media.architecturaldigest.com/photos/59ca74aed8e8323d945a9961/4:3/w_384/Ventana%2520Big%2520Sur%2520Glamping2.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis turpis sit amet varius porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque vitae dui nunc. Phasellus luctus, justo non consequat viverra, ipsum odio elementum erat, quis vehicula sapien sapien euismod massa. Ut blandit porttitor sapien et blandit. Suspendisse a euismod tellus, in suscipit erat. Curabitur sagittis, dolor sit amet faucibus pellentesque, augue magna ornare felis, ut auctor nisl ipsum eget lectus. Ut ornare ipsum sapien. Ut fermentum imperdiet quam ac sagittis. Mauris ultrices feugiat pharetra. In hac habitasse platea dictumst. Vivamus at tincidunt elit."
    },
    {
        name: "View Paradice", 
        image: "http://total-croatia-sailing.com/wp-content/uploads/2017/08/lonely-planet-picks-out-croatias-10-best-beaches.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis turpis sit amet varius porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque vitae dui nunc. Phasellus luctus, justo non consequat viverra, ipsum odio elementum erat, quis vehicula sapien sapien euismod massa. Ut blandit porttitor sapien et blandit. Suspendisse a euismod tellus, in suscipit erat. Curabitur sagittis, dolor sit amet faucibus pellentesque, augue magna ornare felis, ut auctor nisl ipsum eget lectus. Ut ornare ipsum sapien. Ut fermentum imperdiet quam ac sagittis. Mauris ultrices feugiat pharetra. In hac habitasse platea dictumst. Vivamus at tincidunt elit."
    },
    {
        name: "Salomon Creek",
        image: "http://204ksp3os7r62w5qhokpkxci.wpengine.netdna-cdn.com/wp-content/uploads/2014/05/1506953_659266510776894_9016667063679314900_n.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis turpis sit amet varius porttitor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque vitae dui nunc. Phasellus luctus, justo non consequat viverra, ipsum odio elementum erat, quis vehicula sapien sapien euismod massa. Ut blandit porttitor sapien et blandit. Suspendisse a euismod tellus, in suscipit erat. Curabitur sagittis, dolor sit amet faucibus pellentesque, augue magna ornare felis, ut auctor nisl ipsum eget lectus. Ut ornare ipsum sapien. Ut fermentum imperdiet quam ac sagittis. Mauris ultrices feugiat pharetra. In hac habitasse platea dictumst. Vivamus at tincidunt elit."
    },
];


function seedDB(){
    // Remove all campgrounds
    CampGround.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed CampGrounds!");
        
        // add a few campgrounds
        data.forEach(function(seed){
            CampGround.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a CampGround");
                    // Create a Comment
                    Comment.create(
                        {
                            text: "This place is awesome, but I wish there was internet",
                            author: "Huan"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created A Comment!");
                            }
                    });
                }
            });
        });
    });

    // add few comments
}


module.exports = seedDB;