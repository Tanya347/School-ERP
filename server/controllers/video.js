import Video from "../models/Video.js";
import Faculty from "../models/Faculty.js"; 
import Class from "../models/Class.js";
 

export const fetchVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({}); 
        res.status(200).json(videos); 
    } catch (error) {
        next(error); 
    }
}

export const fetchVideo = async (req, res, next) => {
    try{
        const video = await Video.findById(req.params.id).populate('subject','name').populate('standard', 'name'); 
        if (!video){
            return res.status(404).json({message: "Video not found"}); 
        }
        res.json(video);
    }
    catch(err) {
        next(err); 
    }
}

export const fetchVideosFaculty = async (req, res, next) => {
    const faculty_id = req.params.id; 
    try {
        const faculty = await Faculty.findById(faculty_id).populate('standard', 'name').populate('subject', 'name'); 
        if (!faculty){
            return res.json({message: "No faculty exists"}); 
        }
        const videos = await Video.find({faculty: faculty_id}); 
        res.json(videos); 

    } catch (error) {
        next(error); 
    }
}


export const fetchVideosClass = async (req, res, next) => {
    try {
        const class_id = req.params.id;
        const class_name = await Class.findById(class_id); 
        if (!class_name){
            return res.json({message: "Class doesn't exist"}); 
        }
        const videos = await Video.find({standard: class_name._id}).populate('subject','name'); 
        res.json(videos); 
    } catch (error) {
        next(error); 
    }
}


export const addVideos = async (req, res, next) => {
    const newVideo = new Video(req.body); 
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json({ message: "Created successfully! "});
      } catch (err) {
        next(err);
      }
}


export const updateVideo = async (req, res, next) => {
    const video_id = req.params.id; 
    try {   
        const video = Video.findById(video_id); 
        if (!video){
            return res.status(404).json({message: "Video doesn't exist"}); 
        }
        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
          );
        res.status(200).json(updatedVideo);
    } catch (error) {
        next(error); 
    }
}


export const deleteVideo = async (req, res, next) => {
    const video_id = req.params.id; 
    try {
        const video = await Video.findById(video_id); 
        if (!video){
            return res.status(404).json({message: "Video doesn't exist"}); 
        }
        await Video.findByIdAndDelete(video_id); 
        res.status(200).json({message: "Video deleted successfully! "});

    } catch (error) {
        next(error); 
    }
}


