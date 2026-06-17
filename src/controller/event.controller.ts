import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import { Category } from '../models/category.model';
import { Venue } from '../models/venue.model';
import { Op } from 'sequelize';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category_id, venue_id, date } = req.query;
    const where: any = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category_id) {
      where.category_id = category_id;
    }

    if (venue_id) {
      where.venue_id = venue_id;
    }

    if (date) {
      where.date = date;
    }
    const events = await Event.findAll({
      where,
      include: [
        { model: Category },
        { model: Venue }
      ]
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByPk(Number(req.params.id), {
      include: [
        { model: Category },
        { model: Venue }
      ]
    });
    if (!event) {
      res.status(404).json({ message: 'Tapılmadı' });
      return;
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {

    const { category_id, venue_id } = req.body;

    const category = await Category.findByPk(category_id);

    if (!category) {
      res.status(400).json({
        message: `Category ID ${category_id} mövcud deyil`
      });
      return;
    }

    const venue = await Venue.findByPk(venue_id);

    if (!venue) {
      res.status(400).json({
        message: `Venue ID ${venue_id} mövcud deyil`
      });
      return;
    }

    const event = await Event.create(req.body);

    res.status(201).json(event);

  } catch (err) {
    res.status(500).json({
      message: (err as Error).message
    });
  }
};

export const bulkCreateEvents = async (req: Request, res: Response) => {
  try {

    const eventsData = req.body;

    if (!Array.isArray(eventsData)) {
      res.status(400).json({
        message: "Body array olmalıdır"
      });
      return;
    }

    for (const item of eventsData) {

      const category = await Category.findByPk(item.category_id);

      if (!category) {
        res.status(400).json({
          message: `Category ID ${item.category_id} mövcud deyil`
        });
        return;
      }

      const venue = await Venue.findByPk(item.venue_id);

      if (!venue) {
        res.status(400).json({
          message: `Venue ID ${item.venue_id} mövcud deyil`
        });
        return;
      }
    }

    const events = await Event.bulkCreate(eventsData);

    res.status(201).json(events);

  } catch (error) {
    res.status(500).json({
      message: (error as Error).message
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    await Event.update(req.body, { where: { id: Number(req.params.id) } });
    res.json({ message: 'Yeniləndi' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await Event.destroy({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
