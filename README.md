# Setup instructions

## Database connection file

Inside the config folder of the project, add a file database.php.

It should contains the following code:

```
<?php
class Database{

    private $host = "localhost";
    public $site = "localhost/farm2tablerevised"; //change to whsfarm2table.org when deployed.
    private $db_name = "farm2table";
    private $username = "root";
    private $password = "root";
    public $conn;

    public function getConnection(){

        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
```

You may need to change the username and/or password to match your MySQL instance on your local computer. Do ***not*** commit this file since it can potentially conflict with the actual configuration used in the production version of the site as well as the configuration of other people working on this.
