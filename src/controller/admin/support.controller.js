const models = require("../../../models/index");
const { success, errorResponse } = require("../../utils/constants");
module.exports = {
  //This service is responsible for creating a query in the database
  create_ticket: async (req, res, next) => {
    try {
      const UserId = req.user.id;
      const { question, userName, email, userId } = req.body;
      const user = await models.User.findOne({
        where: {
          id: UserId,
        },
      });
      const Question = await models.Tickets.create({
        question: question,
        userName: user.username,
        email: user.email,
        UserId: UserId,
      });
      if (Question.toString() != 0) {
        return res
          .status(201)
          .json(success("Ticket Creation Successfull", res.statusCode));
      } else {
        return res
          .status(400)
          .json(errorResponse("Ticket Creation Failed", res.statusCode));
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  //This service is responsible for getting all the query from the database
  get_all_tickets: async (req, res, next) => {
    try {
      const pageSize = req.query.pageSize; // number of records per page
      const page = req.query.page; // the current page number
      const offset = (page - 1) * pageSize;
      const questions = await models.Tickets.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        limit: pageSize || null,
        offset: offset || null,
      });
      if (questions.length > 0) {
        return res.status(200).json(success(questions, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  //This service is responsible for getting a single query from the database
  get_ticket: async (req, res, next) => {
    try {
      const id = req.params.TicketId;
      const question = await models.Tickets.findOne({
        where: {
          id: id,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (question) {
        return res.status(200).json(success(question, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      if (error.status === undefined) {
        error.status = 500;
      }
      return res
        .status(error.status)
        .json(errorResponse(error.message, error.status));
    }
  },

  //This service is responsible for getting all the queries that have been questioned by a single user from the database
  get_user_tickets: async (req, res, next) => {
    try {
      const id = req.params.userId;
      const question = await models.Tickets.findAll({
        where: {
          UserId: id,
        },
      });
      if (query.toString() != 0) {
        return res.status(200).json(success(question, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for deleting a single query from the database
  delete_ticket: async (req, res, next) => {
    try {
      const { TicketId } = req.params;
      const question = await models.Tickets.destroy({
        where: {
          id: TicketId,
        },
      });
      if (question) {
        return res.status(201).json(success("Ticket Deleted", res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for creating a reponse for a query in the database
  create_chat_by_user: async (req, res, next) => {
    try {
      const { TicketId } = req.params;
      const { message, time, date } = req.body;
      const ticket = await models.Tickets.findOne({
        where: {
          id: TicketId,
        },
      });
      const query = await models.Chat.create({
        messageBy: ticket.userName,
        message: message,
        time: time,
        date: date,
        TicketId: TicketId,
      });
      if (query.toString() != 0) {
        return res.status(201).json(success("Chat Uploaded", res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  //This service is responsible for creating a reponse for a query in the database
  create_chat_by_administration: async (req, res, next) => {
    try {
      const { TicketId } = req.params;
      const { message, time, date } = req.body;
      const admin = await models.User.findOne({
        where: {
          id: req.user.id,
        },
      });
      const ticket = await models.Tickets.findOne({
        where: {
          id: TicketId,
        },
      });
      const query = await models.Chat.create({
        messageBy: admin.username,
        message: message,
        time: time,
        date: date,
        TicketId: TicketId,
      });
      if (query.toString() != 0) {
        return res.status(201).json(success("Chat Uploaded", res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },

  get_user_details_of_tickets: async (req, res, next) => {
    try {
      const UserId = req.params.UserId;
      console.log("User Id: ", UserId);
      const tickets = await models.Tickets.findAll({
        include: [{ model: models.Chat }],
        where: {
          UserId: UserId,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (tickets.length > 0) {
        return res.status(200).json(success(tickets, res.statusCode));
      } else {
        return res
          .status(404)
          .json(errorResponse("Ticket Not Found", res.statusCode));
      }
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },
};
