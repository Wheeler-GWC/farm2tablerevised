<?php
class Food{

    private $conn;
    private $table_name = "food_items";

    public $id;
    public $item;
    public $quantity;
    public $expire_date;
    public $created_at;

    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){

        try{

            $query = "INSERT INTO food_items
                SET item=:item, quantity=:quantity, expire_date=:expire_date, created_at=:created_at";

            $stmt = $this->conn->prepare($query);

            $item=htmlspecialchars(strip_tags($this->item));
            $quantity=htmlspecialchars(strip_tags($this->quantity));
            $expire_date=htmlspecialchars(strip_tags($this->expire_date));

            if ($expire_date == '') {
                $expire_date = null;
            }

            $stmt->bindParam(':item', $item);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':expire_date', $expire_date);
            $created_at=date('Y-m-d H:i:s');
            $stmt->bindParam(':created_at', $created_at);

            if($stmt->execute()){
                return true;
            }else{
                return false;
            }

        }

        catch(PDOException $exception){
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function paginate($where = '', $page = 1, $limit = 10, $orderBy = 'f.item', $orderType = 'asc') {
        $query = "SELECT f.id, f.item, f.quantity, f.expire_date, f.created_at
              FROM ". $this->table_name ." f
              WHERE f.item LIKE :where
              ORDER BY " . $orderBy . " " . $orderType . "
              LIMIT ". ($page - 1) * $limit ."," . $limit . "
              ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':where', $where);
        $stmt->execute();

        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($foods);
    }

    public function count($where = '') {
        $query = "SELECT f.id
              FROM ". $this->table_name ." f
              WHERE f.item LIKE :where
              ";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':where', $where);
        $stmt->execute();

        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return count($foods);
    }

    public function readAll(){

        $query = "SELECT f.id, f.item, f.quantity, f.expire_date, f.created_at
              FROM ". $this->table_name ." f";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $foods = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($foods);
    }

    public function readOne(){

        $query = "SELECT id, item, quantity, expire_date, created_at FROM food_items WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($results);
    }

    public function update(){

        $query = "UPDATE food_items
                SET item=:item, quantity=:quantity, expire_date=:expire_date
                WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $item=htmlspecialchars(strip_tags($this->item));
        $quantity=htmlspecialchars(strip_tags($this->quantity));
        $expire_date=htmlspecialchars(strip_tags($this->expire_date));
        $id=htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':item', $item);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':expire_date', $expire_date);
        $stmt->bindParam(':id', $id);

        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }

    public function delete($ins){
        $ins=htmlspecialchars(strip_tags($ins));
        $query = "DELETE FROM food_items WHERE id IN ($ins)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':ins', $ins);
        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }
}