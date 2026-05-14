const pool = require('../db/pool');

const getCarrierConversations = async (id , statusArray , sender) => {
    const conversations = await pool.query(`
        SELECT 
            conversations.id AS conv_id,
            shipment_id,
            shipments.shipment_number AS shipment_number,
            carriers.name AS carrier_name,
            companies.name AS company_name,
            shipper_locations.name AS shipper_location_name,
            json_agg(
                json_build_object(
                    'text' , messages.text,
                    'sender' , messages.sender,
                    'time_sent' , messages.time_sent,
                    'read_by_receiver' , messages.read_by_receiver
                )ORDER BY time_sent
            )AS messages

        FROM conversations

        JOIN carriers ON conversations.carrier_id = carriers.id

        JOIN companies ON conversations.company_id = companies.id

        JOIN messages ON conversations.id = messages.conversation_id

        JOIN shipper_locations ON conversations.shipper_location_id = shipper_locations.id

        JOIN shipments ON conversations.shipment_id = shipments.id

        WHERE conversations.carrier_id = $1
        AND (messages.read_by_receiver = ANY($2) AND messages.sender = ANY($3))

        GROUP BY conversations.id, shipment_id, carrier_name , company_name , shipper_location_name, shipments.shipment_number
        `,[id , statusArray , sender]);

        return conversations.rows
};

const getShipperConversations = async (id , statusArray , sender) => {
    const conversations = await pool.query(`
        SELECT 
            conversations.id AS conv_id,
            shipment_id,
            shipments.shipment_number AS shipment_number,
            carriers.name AS carrier_name,
            companies.name AS company_name,
            shipper_locations.name AS shipper_location_name,
            json_agg(
                json_build_object(
                    'text' , messages.text,
                    'sender' , messages.sender,
                    'time_sent' , messages.time_sent,
                    'read_by_receiver' , messages.read_by_receiver
                )ORDER BY time_sent
            )AS messages

        FROM conversations

        JOIN carriers ON conversations.carrier_id = carriers.id

        JOIN companies ON conversations.company_id = companies.id

        JOIN messages ON conversations.id = messages.conversation_id

        JOIN shipper_locations ON conversations.shipper_location_id = shipper_locations.id

        JOIN shipments ON conversations.shipment_id = shipments.id

        WHERE conversations.shipper_location_id = $1
         AND (messages.read_by_receiver = ANY($2) AND messages.sender = ANY($3))

        GROUP BY conversations.id, shipment_id, carrier_name , company_name , shipper_location_name, shipments.shipment_number
        `,[id , statusArray , sender]);

        return conversations.rows
}

const createConversation = async (shipmentId , carrierId , shipperId , shipperLocId , sender , text) => {
    try{
        await pool.query(`BEGIN`)

        let conversation = await pool.query(`
            INSERT INTO conversations 
            (shipment_id,
            carrier_id,
            company_id,
            shipper_location_id)
            VALUES($1 , $2 , $3 , $4)
            RETURNING *
            `,[shipmentId , carrierId , shipperId , shipperLocId]);

        let message = await pool.query(`
            INSERT INTO messages
                (text , 
                conversation_id,
                sender)
                VALUES($1 , $2 , $3)
            `,[text , conversation.rows[0].id , sender])

        await pool.query(`COMMIT`)

        return conversation.rows[0]
    }catch(err){
        await pool.query(`ROLLBACK`)
        throw new Error(err.message);
        
    }
};

const createMessage = async (conversationId , text , sender) => {
    let message = await pool.query(`
        INSERT INTO messages
            (text,
            conversation_id,
            sender)
            VALUES($1 , $2 , $3)
        RETURNING *`, [text , conversationId , sender]);

        return message.rows[0]
}

const checkExistingConversation = async (shipmentId) => {
    let existing = await pool.query(`
        SELECT * FROM conversations
        WHERE shipment_id = $1
        `,[shipmentId])

        return existing
}

const getMessages = async (sender , shipperLocId , isRead) => {
    let unread = await pool.query(`
        SELECT
            conversations.id AS convo_id,
            json_agg(
                json_build_obj(
                    '
                )
            )

        FROM conversations

        WHERE conversations.shipper_location_id =$1 AND messages.read_by_receiver = $2
        AND messages.sender <> $2
        `,[shipperLocId , isRead , sender]);

        return unread.rows
}

const readMessages = async (conversationId , sender) => {
    let updatedConvos = await pool.query(`
        UPDATE messages
        SET read_by_receiver = true
        WHERE sender <> $1 AND messages.conversation_id = $2
        `,[sender , conversationId])

        return updatedConvos.rows
}

const getConversation = async (shipmentId) => {
    let conversation = await pool.query(`
        SELECT

        conversations.id AS conv_id,
            shipment_id,
            shipments.shipment_number AS shipment_number,
            carriers.name AS carrier_name,
            companies.name AS company_name,
            shipper_locations.name AS shipper_location_name,
            json_agg(
                json_build_object(
                    'text' , messages.text,
                    'sender' , messages.sender,
                    'time_sent' , messages.time_sent,
                    'read_by_receiver' , messages.read_by_receiver
                )ORDER BY time_sent
            )AS messages

        FROM conversations

        JOIN carriers ON conversations.carrier_id = carriers.id

        JOIN companies ON conversations.company_id = companies.id

        JOIN messages ON conversations.id = messages.conversation_id

        JOIN shipper_locations ON conversations.shipper_location_id = shipper_locations.id

        JOIN shipments ON conversations.shipment_id = shipments.id

        WHERE shipments.id = $1

        GROUP BY conversations.id, shipment_id, carrier_name , company_name , shipper_location_name, shipments.shipment_number
        `,[shipmentId]);

        return conversation.rows[0]
}

module.exports = {getCarrierConversations , getShipperConversations , createConversation , createMessage , checkExistingConversation , getMessages , readMessages , getConversation}