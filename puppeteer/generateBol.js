function generateBolHtml(shipment) {
    console.log('HTML Generation called')
    try {
        console.log('step 1 - mapping orders')
        const orderRowsString = shipment.orders.map(o => `
        <tr>
            <td>${o.order_number}</td>
            <td></td>
            <td>${o.weight}</td>
            <td></td>
        </tr>
        `).join('')


        console.log('step 2 - for each on line items')
        const productRows = []

        shipment.orders.forEach((order) => {
            let orderLineItems = order.order_line_items.map(line_item => `
        <tr>
            <td>${line_item.materialNumber}</td>
            <td>${line_item.quantity}</td>
            <td>${line_item.weight}</td>
            <td>${line_item.description}</td>
            <td>${line_item.freightClass}</td>
        </tr>
        `).join('')

            productRows.push(orderLineItems)
        })
        console.log('step 3 - joining line items from orders')
        const productRowsString = productRows.join('')

        console.log('returning HTML')
        return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #root {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        #title {
            text-align: center;
        }

        #top-section {
            display: flex;
            width: 100%;
        }

        #top-left {
            display: flex;
            flex-direction: column;
            border: solid black 2px;
            flex: 1;

        }

        #top-right {
            display: flex;
            flex-direction: column;
            border: solid black 2px;
            flex: 1;
        }

        .top-left-sub {
            display: flex;
            flex-direction: column;
        }

        .top-right-sub {
            display: flex;
            flex-direction: column;
        }

        span {
            display: inline-block;
        }

        h4 {
            background-color: black;
            color: white;
            margin: 0;
        }

        #mid-section {
            width: 100%;
        }

        .center-header{
            text-align: center;
        }

        table{
            width: 100%;
            border: 2px solid black;
            border-collapse: collapse;
        }

        th{
            border: 2px solid black;
            
        }

        #bottom-section{
            display: flex;
            width: 100%;
        }

        #bottom-left{
            flex: 1;
            border: 2px solid black;
            min-height: 100px;
        }

        #bottom-right{
            flex: 1;
            border: 2px solid black;
            min-height: 100px;
        }

        #liability{
            border: 2px solid black;
            text-align: center;
        }
    </style>
</head>

<body>
    <div id="root">
        <h1 id="title">Bill of Lading</h1>
        <div id="top-section">
            <div id="top-left">
                <div class="top-left-sub">
                    <h4>Ship From</h4>
                    <span><b>Name:</b>${shipment.direction_category === 'outbound' ? shipment.shipper_name : shipment.supplier_name}</span>
                    <span><b>Address:</b>${shipment.direction_category === 'outbound' ? shipment.shipper_address : shipment.supplier_address}</span>
                    <span><b>City/State/Zip:</b>${shipment.direction_category === 'outbound' ? shipment.shipper_city : shipment.supplier_city}, ${shipment.direction_category === 'outbound' ? shipment.shipper_state : shipment.supplier_state} ${shipment.direction_category === 'outbound' ? shipment.shipper_zip : shipment.supplier_zip}</span>
                </div>
                <div class="top-left-sub">
                    <h4>Ship To</h4>
                    <span><b>Name:</b>${shipment.direction_category === 'outbound' ? shipment.customer_name : shipment.shipper_name}</span>
                    <span><b>Address:</b>${shipment.direction_category === 'outbound' ? shipment.customer_address : shipment.shipper_address}</span>
                    <span><b>City/State/Zip:</b>${shipment.direction_category === 'outbound' ? shipment.customer_city : shipment.shipper_city}, ${shipment.direction_category === 'outbound' ? shipment.customer_state : shipment.shipper_state} ${shipment.direction_category === 'outbound' ? shipment.customer_zip : shipment.shipper_zip}</span>
                </div>
            </div>
            <div id="top-right">
                <div class="top-right-sub">
                    <h4>BOL Number</h4>
                    <p>${shipment.shipment_number}</p>
                </div>
                <div class="top-right-sub">
                    <h4>Carrier Info</h4>
                    <span><b>Name: </b>${shipment.carrier_name}</span>
                    <span><b>SCAC: </b>${shipment.carrier_scac}</span>
                </div>
            </div>

        </div>
        <div id="mid-section">
            <h4 class="center-header">Customer Order Information</h4>
            <table >
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th># Packages</th>
                        <th>Weight</th>
                        <th>Additional Info</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderRowsString}
                </tbody>
            </table>
        </div>
        <div id="mid-section">
            <h4 class="center-header">Carrier Information</h4>
            <table >
                <thead>
                    <tr>
                        <th>Product #</th>
                        <th>Qty</th>
                        <th>Weight</th>
                        <th>Description</th>
                        <th>Freight Class</th>
                    </tr>
                </thead>
                <tbody>
                    ${productRowsString}
                </tbody>
            </table>
        </div>
        <div id="liability">
            <p><b>NOTE: </b>Liability limited to actual damages or declared values, often excluding "acts of God," accidents, or theft</p>
        </div>
        <div id="bottom-section">
            <div id="bottom-left">
                <h4 class="center-header">Shipper Signature</h4>
            </div>
            <div id="bottom-right">
                <h4 class="center-header">Carrier Signature</h4>
            </div>
        </div>
    </div>

</body>

</html>
    `
    } catch (error) {
        console.log('HTML Gen Error: ', error)
    }


};

module.exports = { generateBolHtml };