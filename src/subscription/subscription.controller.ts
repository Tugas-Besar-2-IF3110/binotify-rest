import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { xml2json } from 'xml-js';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Get()
    async findAllSubscriptionList(@Req() req: any, @Res() res: any) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token: string = req.headers.authorization.split(' ')[1];
            try {
                const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
                if (decodedToken.isAdmin) {
                    let data = "";
                    await axios.post(`${process.env.BINOTIFY_SOAP_API}/subscription`, 
                        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sub="http://subscription.binotify/">' +
                            '<soapenv:Header/>' +
                            '<soapenv:Body>' +
                            '<sub:listRequestSubscription>' +    
                                '<request>' +
                                    '<API_KEY></API_KEY>' +
                                '</request>' +
                            '</sub:listRequestSubscription>' +
                            '</soapenv:Body>' +
                        '</soapenv:Envelope>', {
                        headers: {
                            'Content-Type': 'text/xml'
                        }
                    }).then(response => {
                        data = xml2json(response.data, { spaces: 2, compact: true });
                        res.send(data);
                    })}
            } catch(e) {}
        }
        return await Promise.resolve({"error": "Unauthorized"});
    }
}
