import Timetable from "../models/Timetable.js";


// Assuming you have a route to create a timetable associated with a class
export const createTimetablee = async (req, res, next) => {
  try {
    const {classId, classAndSec , Monday, Tuesday, Wednesday, Thursday, Friday, slots } = req.body;

    const timetable = await Timetable.create({
      classId,
      classAndSec,
      //semester,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      slots
    });

    res.status(200).json(timetable);
  } catch (err) {
    next(err);
  }
};



// export const updateTimetablee = async (req, res, next) => {
//   try {
//     const { timetableId } = req.params;
//     //const { classAndSec, department, semester, Monday, Tuesday, Wednesday, Thursday, Friday, slots } = req.body;

//     // Find the timetable to update
//     const existingTimetable = await Timetable.findOne({ _id: timetableId });

//     if (!existingTimetable) {
//       return res.status(404).json({ error: "Timetable not found" });
//     }

//     // Update the timetable fields
//     existingTimetable.classAndSec = classAndSec;
//     existingTimetable.department = department;
//     existingTimetable.semester = semester;
//     existingTimetable.Monday = Monday;
//     existingTimetable.Tuesday = Tuesday;
//     existingTimetable.Wednesday = Wednesday;
//     existingTimetable.Thursday = Thursday;
//     existingTimetable.Friday = Friday;
//     existingTimetable.slots = slots;

//     // Save the updated timetable
//     const updatedTimetable = await existingTimetable.save();

//     res.status(200).json(updatedTimetable);
//   } catch (err) {
//     next(err);
//   }
// };


export const updateTimetablee = async (req, res, next) => {
  try {
    //const { classId, timetableId } = req.params;
  


    const updatedTimetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {new: true}
      
    );

    res.status(200).json(updatedTimetable);
  } catch (err) {
    next(err);
  }
};

export const getTimetablee = async (req, res, next) => {
  try {
    const classId = req.params.classId; // Assuming you pass classId as a parameter

    const timetables = await Timetable.find({ classId });
    res.status(200).json(timetables);
  } catch (err) {
    next(err);
  }
};

export const getTimetableById = async (req, res, next) => {
  try {
    const { classId, timetableId } = req.params;

    const timetable = await Timetable.findOne({ _id: timetableId, classId });
    res.status(200).json(timetable);
  } catch (err) {
    next(err);
  }
};


export const deleteTimetablee = async (req, res, next) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(200).json("the Timetable has been deleted");
  } catch (err) {
    next(err);
  }
};


// export const deleteTimetablee = async (req, res, next) => {
//   try {
//     const { classId, timetableId } = req.params;

//     await Timetable.findByIdAndDelete(timetableId);

//     res.status(204).end();
//   } catch (err) {
//     next(err);
//   }
// };
// export const createTimetable = async (req, res, next) => {

//   const newTimetable = new Timetable(req.body);
//   try {
//     const savedTimetable = await newTimetable.save();
//     res.status(200).json(savedTimetable);
//   } catch (err) {
//     next(err);
//   }
// };

// export const updateTimetable = async (req, res, next) => {
//   try {
//     const timetable = await Timetable.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );
//     res.status(200).json(timetable);
//   } catch (err) {
//     next(err);
//   }
// };

// export const deleteTimetable = async (req, res, next) => {
//   try {
//     await Timetable.findByIdAndDelete(req.params.id);
//     res.status(200).json("the Timetable has been deleted");
//   } catch (err) {
//     next(err);
//   }
// };

// export const getTimetable = async (req, res, next) => {
//   try {
//     const timetable = await Timetable.findById(req.params.id);
//     res.status(200).json(timetable);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getTimetables = async (req, res, next) => {
//   try {
//     const timetables = await Timetable.find();
//     res.status(200).json(timetables);
//   } catch (err) {
//     next(err)
//   }
// }
