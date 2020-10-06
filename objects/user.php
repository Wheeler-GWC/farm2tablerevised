<?php
class User{

    private $conn;
    private $table_name = "users";

    public $id;
    public $email;
    public $password;
    public $is_admin;
    public $token;

    public function __construct($db){
        $this->conn = $db;
    }

    public function auth() {
        try {
            $query = "SELECT id, email, password, is_admin
                FROM " . $this->table_name . "
                WHERE email = :email";

            $stmt = $this->conn->prepare($query);

            $email=htmlspecialchars(strip_tags($this->email));
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = null;
            $results=$stmt->fetchAll(PDO::FETCH_OBJ);
            if(count($results) > 0) {
                $result = $results[0];
                if(password_verify($this->password, $result->password)) {
                    session_start();
                    $user = $result;
                    $_SESSION['id'] = $user->id;
                    $_SESSION['email'] = $user->email;
                    $_SESSION['is_admin'] = $user->is_admin;
                }
            }

            return $user;
        } catch(PDOException $exception) {
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function create(){
        try{

            $query = "SELECT id
                FROM " . $this->table_name . "
                WHERE email = :email";

            $stmt = $this->conn->prepare($query);

            $email=htmlspecialchars(strip_tags($this->email));
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = null;
            $results=$stmt->fetchAll(PDO::FETCH_ASSOC);

            if(count($results) > 0) {
                return 'Your email has been registered. Please pick another email.';
            } else {
                $query = "INSERT INTO users
                    SET email=:email, password=:password, is_admin=:is_admin";

                $stmt = $this->conn->prepare($query);

                $email=htmlspecialchars(strip_tags($this->email));
                $password=htmlspecialchars(strip_tags($this->password));
                $salted_password = password_hash($password, PASSWORD_BCRYPT);
                $is_admin = 0;

                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $salted_password);
                $stmt->bindParam(':is_admin', $is_admin);

                if($stmt->execute()){
                    return 'true';
                }else{
                    return 'false';
                }
            }
        }
        catch(PDOException $exception){
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function insertIntoPasswordResets() {
        try {
            $sql = "INSERT INTO password_resets(email, token) VALUES (:email, :token)";

            $stmt = $this->conn->prepare($sql);
            $email=htmlspecialchars(strip_tags($this->email));
            $stmt->bindParam(':email', $email);
            $token=htmlspecialchars(strip_tags($this->token));
            $stmt->bindParam(':token', $token);
            if($stmt->execute()){
                return 'true';
            }else{
                return 'false';
            }
        }
        catch(PDOException $exception){
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function paginate($where = '', $page = 1, $limit = 10, $orderBy = 'id', $orderType = 'desc') {
        $query = "SELECT id, email
              FROM ". $this->table_name ."
              WHERE email LIKE :where
              ORDER BY " . $orderBy . " " . $orderType . "
              LIMIT ". ($page - 1) * $limit ."," . $limit . "
              ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':where', $where);
        $stmt->execute();

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($users);
    }

    public function count($where = '') {
        $query = "SELECT p.id
              FROM ". $this->table_name ." p
              WHERE p.email LIKE :where
              ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':where', $where);
        $stmt->execute();

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return count($users);
    }

    public function readAll(){

        $query = "SELECT p.id, p.email
              FROM ". $this->table_name ." p ORDER BY id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($foods);
    }

    public function readOne(){

        $query = "SELECT id, email, is_admin
                    FROM " . $this->table_name . "
                    WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($results);
    }

    public function getUserByEmail(){
        $query = "SELECT * FROM users WHERE email = :email";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        return (bool)$stmt->fetchColumn();
    }

    public function update(){

        $query = "UPDATE users
                SET password=:password
                WHERE email=:email";

        $stmt = $this->conn->prepare($query);
        $email=htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':email', $email);
        $password=htmlspecialchars(strip_tags($this->password));
        $salted_password = password_hash($password, PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $salted_password);

        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }

    public function delete($ins){

        $ins=htmlspecialchars(strip_tags($ins));
        $query = "DELETE FROM users WHERE id IN ($ins)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':ins', $ins);
        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }

    public function getEmailByToken() {
        $query = "SELECT email FROM password_resets WHERE token = :token";

        $stmt = $this->conn->prepare($query);

        $token=htmlspecialchars(strip_tags($this->token));
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        $results=$stmt->fetchAll(PDO::FETCH_COLUMN, 0);

        return json_encode($results);
    }
}