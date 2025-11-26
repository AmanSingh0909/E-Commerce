const express = require('express');
const Category = require('../models/category');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        return res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
});

// // Get category by ID
// router.get('/:id', async (req, res) => {
//     const category = await Category.findById(req.params.id);
//     if (!category) {
//         return res.status(500).json({ message: 'The category with the given ID was not found.' });
//     }
//     res.status(200).send(category);
// });

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();

    if (!category)
        return res.status(404).send('The category cannot be created!');
    res.send(category);
});


// router.put('/:id', async (req, res) => {
//     const category = await Category.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             icon: req.body.icon || category.icon,
//             color: req.body.color
//         },
//         { new: true }
//     );
//     if (!category)
//         return res.status(404).send('The category cannot be updated!');
//     res.send(category);
// });


router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR =>", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
});



module.exports = router;