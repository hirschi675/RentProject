<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>
<body>
    <div style="display: block; margin: 0 auto; width: 500px; margin-bottom: 20px; padding: 10px; background-color: lightgray; text-align: center;">
        <form name="form" method="post" action="upload.php" enctype="multipart/form-data" >
            Url: <input id="url" type="text" placeholder="Url"/><br><br>
            Title: <input id="title" type="text" placeholder="Title"/><br><br>
            Type: <input type="text" placeholder="Type"><br><br>
            <!-- Owner: <input type="text" v-model="itemOwner"><br><br> -->
            <img id="output" width="200" />	
            <div>Image:</div> <input type="file" accept="image/*" name="my_file" action="upload.php" id="myfile" onchange="loadFile(event)" placeholder="Image" /><br><br>
            Description: <br> <textarea id="w3review" name="w3review" placeholder="Enter Description" rows="4" cols="50"></textarea><br><br>
            <input type="submit" name="submit" value="Upload"/>
        </form>
        <!-- <button id="createButton" onclick="setMetaTags()">Submit</button> -->
    </div>
    <!-- <form name="form" method="post" action="upload.php" enctype="multipart/form-data" >
        <input type="file" name="my_file" /><br /><br />
        <input type="submit" name="submit" value="Upload"/>
    </form> -->
    <script>

        function setMetaTags() {
            var url = document.getElementById("url");
            var title = document.getElementById("title");
            var link = document.createElement('meta');
    
            console.log(url.value);
            console.log(title.value);

            if(url.value.length > 0) {
                console.log("Length is ", url.value.length);
            }
    
            link.setAttribute('property', 'og:url');
            link.content = url.value;
            document.getElementsByTagName('head')[0].appendChild(link);
            
        }
    
        var loadFile = function(event) {
            var image = document.getElementById('output');
            image.src = URL.createObjectURL(event.target.files[0]);
        };
      </script>
</body>
</html>