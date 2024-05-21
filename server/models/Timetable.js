import mongoose from "mongoose"; 

// need to make subjects

const TimetableSchema = new mongoose.Schema({

   classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class", // Assuming your class model is named "Class"
    required: true
  },
    Monday:[
        {
            start_time: String,
            end_time: String,
            subject: String,
            teacher: String,
            topic: String
        }
    ],
    Tuesday:[
        {
            start_time: String,
            end_time: String,
            subject: String,
            teacher: String,
            topic: String
        }
    ],
    Wednesday:[
        {
            start_time: String,
            end_time: String,
            subject: String,
            topic: String
        }
    ],
    Thursday:[
        {
            start_time: String,
            end_time: String,
            subject: String,
            topic: String
        }
    ],
    Friday:[
        {
            start_time: String,
            end_time: String,
            subject: String,
            topic: String
        }
    ],

    slots: [
        {
          faculty: {
            type: String,
            required: true
          },
          sections: {
            type: String,
            required: true
          },
          subject: {
            type: String,
            required: true
          },
          numLectures: {
            type: String,
            required: true
          }
        }
      ]
    })
    
    export default mongoose.model ("Timetable", TimetableSchema);
