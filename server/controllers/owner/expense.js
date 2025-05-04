import db from "../../config/dbconfig.js";

// Create new expense
export const createExpense = async (req, res) => {
  try {
    const {
      e_head,
      head_name,
      amount,
      date,
      details,
      receipt_no,
      farmId
    } = req.body;

    if (!e_head || !amount || !date || !farmId) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    await db.query(
      `INSERT INTO expense 
        (e_head, head_name, amount, date, details, receipt_no, farm_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [e_head, head_name, amount, date, details, receipt_no, farmId]
    );

    res.status(201).json({ message: "Expense recorded successfully." });
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};



// Get all expenseId for a specific farm
export const getExpensesByFarm = async (req, res) => {
  try {
    const { farmId } = req.params;

    const [expenseId] = await db.query(
      `SELECT e.*, eh.type AS expense_head_type 
       FROM expense e 
       JOIN expense_head eh ON e.e_head = eh.head_id 
       WHERE e.farm_id = ?
       ORDER BY e.date DESC`,
      [farmId]
    );

    res.status(200).json(expenseId);
  } catch (err) {
    console.error("Error fetching expenseId:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Update expense
export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const {
      e_head,
      head_name,
      amount,
      date,
      details,
      receipt_no
    } = req.body;

    const [result] = await db.query(
      `UPDATE expense SET 
        e_head = ?, 
        head_name = ?, 
        amount = ?, 
        date = ?, 
        details = ?, 
        receipt_no = ?
       WHERE serial_number = ?`,
      [e_head, head_name, amount, date, details, receipt_no, expenseId]
    );

    res.status(200).json({ message: "Expense updated successfully." });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    await db.query(`DELETE FROM expense WHERE serial_number = ?`, [expenseId]);

    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all expense heads
export const getExpenseHeads = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM expense_head`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching expense heads:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Get all expenses of the login farm owner
export const getAllExpenses = async (req, res) => {
  try {
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

  
    const [expenses] = await db.query(
      `SELECT e.*, eh.type AS expense_head_type 
       FROM expense e 
       JOIN expense_head eh ON e.e_head = eh.head_id 
       JOIN farm f ON e.farm_id = f.id 
       WHERE f.owner_id = ? 
       ORDER BY e.date DESC`,
      [farmOwnerId]
    );

    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Get specific expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const [expense] = await db.query(
      `SELECT e.*, eh.type AS expense_head_type 
       FROM expense e 
       JOIN expense_head eh ON e.e_head = eh.head_id 
       WHERE e.serial_number = ?`,
      [expenseId]
    );

    if (expense.length === 0) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json(expense[0]);
  } catch (err) {
    console.error("Error fetching expense:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};