import React, { useMemo, useState, useEffect } from "react";
import { useTable, useGlobalFilter, useFilters } from "react-table";
import { COLUMNS } from "./column";
import "./dashboard.css";
import { GlobalFilter } from "./GlobalFilter";
import axios from "axios";

export const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getCustomers().then((response) => {
      setLoader(false);
      setCustomers(...customers, response);
    });
    setInterval(() => {
      setLoader(true);
      getCustomers().then((response) => {
        setLoader(false);
        setCustomers(...customers, response);
      });
    }, 10000);
  }, []);

  const getCustomers = () => {
    return new Promise((resolve, reject) => {
      axios.get(`http://localhost:8097/api/v1/customers`).then((response) => {
        var customersTemp = [];
        if(response.data.customerList.length>0){
        response.data.customerList.map((customer) => {
           var tableData = {
            customerName: "",
            vehicleId: "",
            regNo: "",
            status: "",
          };
            customer.vehicleList.map((vehicle) => {
            tableData.customerName = customer.customerName;
            tableData.vehicleId = vehicle.vehicleId;
            tableData.regNo = vehicle.regNo;
            tableData.status = vehicle.status;
            customersTemp.push(tableData);
            tableData = {
                customerName: "",
                vehicleId: "",
                regNo: "",
                status: "",
              };
           });
        });
        resolve(customersTemp);
      } else {
        alert('No Data found');
      }
         
      });
    });
  };

  const columns = useMemo(() => COLUMNS);
  const data = useMemo(() => customers);
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter
  );

  const { globalFilter } = state;
  if (loader) {
    return <div>Loading....</div>;
  }
  return (
    <div>
      <div className="animated-fadeIn">
        <div className="row">
          <div className="card">
            <div
              className="card-header"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                width: "100%",
                height: "70px",
              }}
            >
              <h2 style={{ marginLeft: "35%", paddingTop: "15px" }}>
                <div>
                  {" "}
                  <b>CUSTOMER VEHICLES MONITORING DISPLAY</b>
                </div>
              </h2>
            </div>
            <br />
            <>
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
              <br />
              <br />
              <table {...getTableProps}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render("Header")}
                          <div>
                            {column.canFilter ? column.render("Filter") : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}{" "}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
