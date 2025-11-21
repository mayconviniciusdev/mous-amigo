import type { RequestHandler } from "express";
import * as events from '../services/events.js'
import z from "zod";

export const getAll: RequestHandler = async (req, res) => {
  const items = await events.getAll();
  if (items) return res.json({events: items})

  res.json({error: 'Ocorreu um erro!'})
}

export const getEvent: RequestHandler = async (req, res) => {
  const {id} = req.params;
  const eventItem = await events.getOne(parseInt(id!));
  if(eventItem) return res.json({event: eventItem})

  res.json({error: 'Ocorreu um erro!'})
}

export const addEvent: RequestHandler = async (req, res) => {
  const addEventSchema = z.object({
    title: z.string(),
    description: z.string(),
    grouped: z.boolean()
  });
  const body = addEventSchema.safeParse(req.body);
  if(!body.success) return res.json({error: 'Dados inválidos!'})

  const newEvent = await events.add(body.data);
  if(newEvent) return res.status(201).json({event: newEvent});

  res.json({error: 'Ocorreu um erro!'})
}

export const uptadeEvent: RequestHandler = async (req, res) => {
  const {id} = req.params;
  const uptadeEventSchema = z.object({
    status: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    grouped: z.boolean().optional()
  });
  const body = uptadeEventSchema.safeParse(req.body);
  if(!body.success) return res.json({error: 'Dados inválidos!'})

  const data = Object.fromEntries(Object.entries(body.data).filter(([_, v]) => v !== undefined));
  const updateEvent = await events.update(parseInt(id!), data);
  if(updateEvent) return res.json({event: updateEvent});

  res.json({error: 'Ocorreu um erro!'})
}

export const deleteEvent: RequestHandler = async (req, res) => {
  const {id} = req.params;
  const deletedEvent = await events.remove(parseInt(id!));
  if(deletedEvent) return res.json({event: deletedEvent})

  res.json({error: 'Ocorreu um erro!'})
}