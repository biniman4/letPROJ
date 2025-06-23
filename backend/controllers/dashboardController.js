import User from "../models/User.js";
import Letter from "../models/Letter.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Total users
    const userCount = await User.countDocuments();
    // Total letters
    const letterCount = await Letter.countDocuments();
    // Unique departments from users
    const userDepartments = await User.distinct("departmentOrSector");
    // Unique departments from letters
    const letterDepartments = await Letter.distinct("department");
    // Letters by status (for line/bar chart)
    const letterStatusCounts = await Letter.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    // Letters by department (for pie/bar chart)
    const letterDeptCounts = await Letter.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    // Letters over time (for line chart)
    const lettersByDate = await Letter.aggregate([
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      userCount,
      letterCount,
      departmentCount: new Set([...userDepartments, ...letterDepartments]).size,
      letterStatusCounts,
      letterDeptCounts,
      lettersByDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 