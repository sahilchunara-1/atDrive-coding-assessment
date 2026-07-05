import mongoose from 'mongoose';
const healthController = {
    health: async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: 'Server is healthy',
                mysql: 'Connected',
                mongodb:
                    mongoose.connection.readyState === 1
                        ? 'Connected'
                        : 'Disconnected'
            });


        } catch (error) {
            console.log('error in tesing api  --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

    }
}

export default healthController;