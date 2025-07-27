const Tag = require('../models/Tag');
const Question = require('../models/Question');
const cache = require('../services/cacheService');
const cacheKeys = require('../utils/cacheKeys');

exports.getAllTags = async () => {
    return await Tag.find().sort({ createdAt: -1 });
};

exports.createTag = async ({ name, description }) => {
    const exists = await Tag.findOne({ name: name.toLowerCase().trim() });
    if (exists) throw new Error('TAG_EXISTS');
    return await Tag.create({ name: name.trim(), description });
};

exports.updateTag = async (id, data) => {
    return await Tag.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteTag = async (id) => {
    return await Tag.findByIdAndDelete(id);
};

exports.getQuestionsByTag = async (tagId) => {
    return await Question.find({ tags: tagId })
        .populate('tags')
        .populate('author', 'username avatar reputation');
};

exports.getPopularTags = async (limit = 10) => {
    const cached = await cache.get(cacheKeys.popularTags);
    if (cached) return cached;
    const agg = await Question.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'tags',
                localField: '_id',
                foreignField: '_id',
                as: 'tag'
            }
        },
        { $unwind: '$tag' },
        {
            $project: {
                _id: '$tag._id',
                name: '$tag.name',
                description: '$tag.description',
                count: 1
            }
        }
    ]);

    await cache.set(cacheKeys.popularTags, agg, 120);
    return agg;
};