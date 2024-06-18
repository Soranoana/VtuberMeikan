import React from 'react';
import { createSwaggerSpec } from "next-swagger-doc";
// import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const ApiDoc = ({ spec }) => {
    // docを空ページに差し替えて無効化
    // return <SwaggerUI spec={spec} />;
    return <></>
};

export const getStaticProps = async ctx => {
    const spec = createSwaggerSpec({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'vtmeikan API',
                version: '0.9.1',
            },
        },
    });
    return {
        props: {
            spec,
        },
    };
};

export default ApiDoc;
