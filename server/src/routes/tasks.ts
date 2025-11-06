import { Router } from 'express';
import { Task } from '../models/Task';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../validators/task';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { q, status, page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { owner: req.userId };

    if (status) {
      filter.status = status;
    }

    if (q) {
      // Use regex for more flexible search if text index fails
      const searchQuery = q as string;
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } },
      ];
    }

    const [items, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({
      items: items.map((item) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        status: item.status,
        tags: item.tags,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      total,
      page: pageNum,
      pages,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await Task.create({
      ...data,
      owner: req.userId,
    });

    res.status(201).json({
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = updateTaskSchema.parse(req.body);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      data,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
