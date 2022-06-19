import React, { Component } from 'react';

const $ = require('jquery');
$.DataTable = require('datatables.net');

export class DataTable extends Component
{
    componentDidMount()
    {
        this.$el = $(this.el);

        let dataObj = [];

        /* before setting data, organize it in right order */

        for (let x = 0; x < this.props.data.length; x++) /* for each row */
        {
            const { email, username, fullname, birthday, job_title, employer, city, phone_number } = this.props.data[x];
            
            let dataRowDirty = [];
            let dataRow = [];
            dataRowDirty.push(email, username, fullname, birthday, job_title, employer, city, phone_number);
            for (let y = 0; y < 8; y++)
            {
                if (dataRowDirty[y] === undefined)
                {
                    dataRow.push('');
                }
                else
                {
                    dataRow.push(dataRowDirty[y]);
                }
            }
            
            dataObj.push(dataRow);
        }
        
        this.$el.DataTable(
        {
            data: dataObj,
            columns:
            [
                { title: "Email"},
                { title: "Username"},
                { title: "Full Name"},
                { title: "Birthday"},
                { title: "Job Title"},
                { title: "Employer"},
                { title: "City"},
                { title: "Phone Number"}
            ],
            paging: false,
            deferRender: true,
            scroller: true,
            cache: false
        }
        )
    }

    componentWillUnmount()
    {
        this.$el.destroy(true);
    }

    render()
    {
        return(
            <div className = 'adminresource' id = 'allusersdiv'>
                <table className='display' width="100%" ref={el => this.el = el}></table>
            </div>
        )
    }
}
export default DataTable;