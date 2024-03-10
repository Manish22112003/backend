import express from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";

export const getDetails = async (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((error) => res.json(error));
};
