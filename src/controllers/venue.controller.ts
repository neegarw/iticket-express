import { Request, Response } from 'express';
import {Venue} from '../models/venue.model'
import { Op } from 'sequelize';

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const where: any = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    const venues = await Venue.findAll({ where });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const venue = await Venue.findByPk(Number(req.params.id));
    if (!venue) {
      res.status(404).json({ message: 'Tapılmadı' });
      return;
    }
    res.json(venue);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const bulkCreateVenues = async (req: Request, res: Response) => {
  try {
    const venues = await Venue.bulkCreate(req.body);

    res.status(201).json(venues);
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    await Venue.update(req.body, { where: { id: Number(req.params.id) } });
    res.json({ message: 'Yeniləndi' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await Venue.destroy({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};