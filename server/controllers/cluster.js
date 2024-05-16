import Cluster from "../models/Cluster.js";

export const createCluster = async (req, res, next) => {

    const newCluster = new Cluster(req.body);
    try {
        const savedCluster = await newCluster.save();
        res.status(200).json(savedCluster);
    } catch (err) {
        next(err);
    }
};

export const getClusters = async (req, res, next) => {
    try {
        const clusters = await Cluster.find().populate('student_id', 'name');
        res.status(200).json(clusters);
    } catch (err) {
        next(err)
    }
};