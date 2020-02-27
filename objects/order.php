<?php
class Order{

    private $conn;
    private $table_name = "orders";

    public $id;
    public $item;
    public $items;
    public $userId;
    public $last_id;

    public function __construct($db){
        $this->conn = $db;
    }

    public function create(){

        try{
            $query = "INSERT INTO orders SET userId=:userId";
            $stmt = $this->conn->prepare($query);
            $userId=htmlspecialchars(strip_tags($this->userId));
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();

            $inserted_id = $this->conn->lastInsertId();
            return $inserted_id;
        }

        catch(PDOException $exception){
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function create_items() {
        try {
            $query = "INSERT INTO order_items SET order_id=:order_id, item_id=:item_id;";
            $query .= "UPDATE food_items SET quantity = quantity - 1 WHERE id=:item_id";
            $stmt = $this->conn->prepare($query);
            $last_id=htmlspecialchars(strip_tags($this->last_id));
            $stmt->bindParam(':order_id', $last_id);
            $item=htmlspecialchars(strip_tags($this->item));
            $stmt->bindParam(':item_id', $item);
            $stmt->execute();

            return true;
        }

        catch(PDOException $exception) {
            die('ERROR: ' . $exception->getMessage());
        }
    }

    public function count($where = '') {
        $query = "SELECT id FROM orders WHERE o.item LIKE :where";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':where', $where);
        $stmt->execute();

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return count($orders);
    }

    public function count_items($where = '') {
        $query = "SELECT * FROM order_items WHERE i.item LIKE :where";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':where', $where);
        $stmt->execute();

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return count($items);
    }

    public function readAll() {
        $query = "SELECT * FROM orders";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($orders);
    }

    public function readAllWithDetails(){
        $query = "SELECT u.email, i.id, o.created_at, i.is_fulfilled, f.item, f.quantity FROM orders o ";
        $query .= "INNER JOIN users u ON o.userId = u.id ";
        $query .= "INNER JOIN order_items i ON o.id = i.order_id ";
        $query .= "INNER JOIN food_items f ON i.item_id = f.id ";
        $query .= "WHERE o.created_at >= DATE(NOW()) - INTERVAL 7 DAY";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($orders);
    }

    public function fulfill() {
        $query = "UPDATE order_items SET is_fulfilled = 1 WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $id);
        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }

    public function readOne(){
        $query = "SELECT * FROM orders WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($results);
    }

    public function delete($ins){
        $ins=htmlspecialchars(strip_tags($ins));
        $item = htmlspecialchars(strip_tags($this->item));
        $query = "DELETE FROM orders WHERE id IN ($ins)";
        $query .= "UPDATE food_items SET item = item + 1 WHERE id = :item";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':ins', $ins);
        $stmt->bindParam(':item', $item);
        if($stmt->execute()){
            return true;
        }else{
            return false;
        }
    }
}
