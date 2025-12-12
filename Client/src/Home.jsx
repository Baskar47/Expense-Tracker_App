import React, { useEffect, useState } from "react";
import "./index.css";
import { api } from "./api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");


  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category || !form.date) {
      alert("Please fill title, amount, category and date");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    try {
      if (editingId) {
        
        await api.put(`/expenses/${editingId}`, payload);
      } else {
       
        await api.post("/expenses", payload);
      }

      setForm({
        title: "",
        amount: "",
        category: "",
        date: "",
        note: "",
      });
      setEditingId(null);
      loadExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("Something went wrong");
    }
  };


  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10), 
      note: expense.note || "",
    });
  };


  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;

    try {
      await api.delete(`/expenses/${id}`);
      loadExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Delete failed");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      amount: "",
      category: "",
      date: "",
      note: "",
    });
  };

 
  const filteredExpenses = expenses.filter((exp) => {
    let byCategory = true;
    let byMonth = true;

    if (filterCategory !== "all") {
      byCategory = exp.category === filterCategory;
    }

    if (filterMonth !== "all") {
      const d = new Date(exp.date);
      const month = d.getMonth() + 1; 
      const year = d.getFullYear();
      const [filterYear, filterMonthNum] = filterMonth.split("-");
      byMonth =
        Number(filterYear) === year && Number(filterMonthNum) === month;
    }

    return byCategory && byMonth;
  });

 
  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

 
  const categories = Array.from(
    new Set(expenses.map((e) => e.category))
  );


  const monthOptions = Array.from(
    new Set(
      expenses.map((e) => {
        const d = new Date(e.date);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        return `${y}-${m.toString().padStart(2, "0")}`;
      })
    )
  ).sort();

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>

    
      <form onSubmit={handleSubmit} className="form-container" >
        <input
          name="title"
          placeholder="Title (Tea, Taxi, Rent...)"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category (Food, Travel...)"
          value={form.category}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <textarea
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          rows={2}
        />
        <div style={{ display: "flex", gap: 8, gridColumn: "1 / -1" }}>
          <button type="submit">
            {editingId ? "Update Expense" : "Add Expense"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                backgroundColor: "#6b7280",
                color: "white",
                flex: 1,
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

   
      <div className="filters">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="all">All months</option>
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

    
      {loading && <p>Loading...</p>}

   
      <div className="total-box">
        Total Amount: ₹ {totalAmount.toFixed(2)}
      </div>

   
      <div className="expense-list">
        {filteredExpenses.length === 0 && !loading && (
          <p>No expenses found.</p>
        )}

        {filteredExpenses.map((exp) => (
          <div key={exp._id} className="expense-item">
            <div className="expense-info">
              <span className="expense-title">
                {exp.title} - ₹{exp.amount}
              </span>
              <span className="expense-meta">
                {exp.category} •{" "}
                {new Date(exp.date).toLocaleDateString()}{" "}
                {exp.note && `• ${exp.note}`}
              </span>
            </div>
            <div className="expense-actions">
              <button
                className="btn-edit"
                onClick={() => handleEdit(exp)}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(exp._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
